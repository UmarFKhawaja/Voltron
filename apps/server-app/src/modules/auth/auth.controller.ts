import { Body, Controller, Get, Inject, Post, Req, Res, UseGuards } from '@nestjs/common';
import { EmailAddressChanged, FAILURE, Information, Result, SUCCESS, Token } from '@voltron/common-library';
import {
  AccessService,
  AccessAction,
  MailService,
  User,
  VerificationRequest,
  VerificationRequestPurpose
} from '@voltron/core-library';
import { CERBOS_CONSTANTS, REDIS_CONSTANTS } from '@voltron/data-library';
import { Request, Response } from 'express';
import { createEmailAddressChanged, extractSession, extractToken } from './auth.methods';
import { AuthTokenService } from './core/token.service';
import { AuthURLService } from './core/url.service';
import { AuthUserService } from './core/user.service';
import { AuthVerificationRequestService } from './core/verification-request.service';
import { AuthJwtAuthGuard } from './jwt/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(CERBOS_CONSTANTS.Symbols.Services.AccessService)
    private readonly accessService: AccessService,
    @Inject(REDIS_CONSTANTS.Symbols.Services.MailService)
    private readonly mailService: MailService,
    private readonly tokenService: AuthTokenService,
    private readonly urlService: AuthURLService,
    private readonly userService: AuthUserService,
    private readonly verificationRequestService: AuthVerificationRequestService
  ) {
  }

  @Post('register')
  async post(@Body() {
    displayName,
    userName,
    emailAddress,
    password
  }: {
    displayName: string,
    userName: string,
    emailAddress: string,
    password: string
  }): Promise<Result<void>> {
    try {
      const user: User = await this.userService.registerUser(displayName, userName, emailAddress, password);

      const verificationRequest: VerificationRequest = await this.verificationRequestService.createRegisterVerificationRequest(user);

      const verificationURL: string = this.urlService.formatRegisterVerificationURL(verificationRequest);

      await this.mailService.sendRegisterMail(user.emailAddress, verificationURL);

      return SUCCESS<void>(void 0);
    } catch (error: unknown) {
      return FAILURE<void>(error as Error);
    }
  }

  @Post('request-activation-code')
  async requestActivationCode(@Body() {
    username
  }: {
    username: string;
  }): Promise<Result<void>> {
    try {
      const user: User | null = await this.userService.findUserByUsername(username);

      if (!user) {
        return FAILURE<void>('a user with the specified username could not be found');
      }

      if (user.verifiedAt) {
        return FAILURE<void>('the user with the specified username is already activated');
      }

      const verificationRequest: VerificationRequest = await this.verificationRequestService.createRegisterVerificationRequest(user);

      const verificationURL: string = this.urlService.formatRegisterVerificationURL(verificationRequest);

      await this.mailService.sendRegisterMail(user.emailAddress, verificationURL);

      return SUCCESS<void>(void 0);
    } catch (error: unknown) {
      return FAILURE<void>(error as Error);
    }
  }

  @Post('activate-account')
  async activateAccount(@Req() req: Request, @Body() {
    activationCode
  }: {
    activationCode: string;
  }): Promise<Result<Token>> {
    try {
      let user: User | null = await this.verificationRequestService.getUserForVerificationRequest(activationCode);

      const verificationRequest: VerificationRequest = await this.verificationRequestService.completeVerificationRequest(user, activationCode);

      user = await this.userService.verifyUser(user);

      if (!user) {
        return FAILURE<Token>('a user with the specified ID could not be found');
      }

      if (!user.verifiedAt) {
        return FAILURE<Token>('the user with the specified user ID is not verified');
      }

      await this.tokenService.invalidateToken(extractSession(req));

      return await this.tokenService.generateToken(user);
    } catch (error: unknown) {
      return FAILURE<Token>(error as Error);
    }
  }

  @UseGuards(AuthJwtAuthGuard)
  @Post('logout')
  async logout(@Req() req: Request, @Res() res: Response): Promise<void> {
    try {
      await this.tokenService.invalidateToken(extractSession(req));

      res.status(200).end();
    } catch (error: unknown) {
      res.status(500).end();
    }
  }

  @UseGuards(AuthJwtAuthGuard)
  @Get('verify-session')
  async verifySession(): Promise<Result<boolean>> {
    return SUCCESS<boolean>(true);
  }

  @UseGuards(AuthJwtAuthGuard)
  @Get('get-information')
  async getInformation(@Req() req: Request): Promise<Result<Information>> {
    try {
      const user: User = req.user as User;

      const verificationRequest: VerificationRequest | null = await this.verificationRequestService
        .findVerificationRequestByUserAndPurpose(user, VerificationRequestPurpose.CHANGE_EMAIL_ADDRESS);

      const hasAccess: boolean = await this.accessService.checkVerificationRequestAccess(user, verificationRequest, AccessAction.SELECT);

      if (!hasAccess) {
        return FAILURE<Information>('you do not have access to the information');
      }

      const information: Information = {
        emailAddressChanged: createEmailAddressChanged(verificationRequest)
      };

      return SUCCESS<Information>(information);
    } catch (error: unknown) {
      return FAILURE<Information>(error as Error);
    }
  }

  @UseGuards(AuthJwtAuthGuard)
  @Post('update-profile')
  async updateProfile(@Req() req: Request, @Body() {
    displayName,
    userName
  }: {
    displayName: string;
    userName: string;
  }): Promise<Result<Token>> {
    try {
      let user: User = req.user as User;

      const hasAccess: boolean = await this.accessService.checkUserAccess(user, user, AccessAction.UPDATE);

      if (!hasAccess) {
        return FAILURE<Token>('you do not have access to the profile');
      }

      user = await this.userService.updateUser(user, displayName, userName);

      await this.tokenService.invalidateToken(extractSession(req));

      return await this.tokenService.generateToken(user);
    } catch (error: unknown) {
      return FAILURE<Token>(error as Error);
    }
  }

  @UseGuards(AuthJwtAuthGuard)
  @Post('start-email-address-change')
  async startEmailAddressChange(@Req() req: Request, @Body() {
    emailAddress
  }: {
    emailAddress: string;
  }): Promise<Result<Information>> {
    try {
      const user: User = req.user as User;

      const hasAccess: boolean = await this.accessService.checkUserAccess(user, user, AccessAction.UPDATE);

      if (!hasAccess) {
        return FAILURE<Information>('you do not have access to change the email address');
      }

      const token: string = await this.tokenService.createToken(user);

      const verificationRequest: VerificationRequest = await this.verificationRequestService
        .createChangeEmailVerificationRequest(user, emailAddress, 'OLD_EMAIL_ADDRESS_NOT_CONFIRMED');

      const confirmationURL: string = this.urlService.formatConfirmEmailAddressChangeConfirmationURL(token, verificationRequest.code);

      const hasSucceeded: boolean = await this.mailService.sendConfirmEmailAddressChange(
        user.emailAddress,
        confirmationURL
      );

      if (!hasSucceeded) {
        return FAILURE<Information>('the email containing confirmation link could not be sent');
      }

      return SUCCESS<Information>({
        emailAddressChanged: createEmailAddressChanged(verificationRequest)
      });
    } catch (error: unknown) {
      return FAILURE<Information>(error as Error);
    }
  }

  @UseGuards(AuthJwtAuthGuard)
  @Post('confirm-email-address-change')
  async confirmEmailAddressChange(@Req() req: Request, @Body() {
    confirmationCode
  }: {
    confirmationCode: string;
  }): Promise<Result<Information>> {
    try {
      const user: User = req.user as User;

      const hasAccess: boolean = await this.accessService.checkUserAccess(user, user, AccessAction.UPDATE);

      if (!hasAccess) {
        return FAILURE<Information>('you do not have access to confirm the email address');
      }

      let verificationRequest: VerificationRequest | null = await this.verificationRequestService.completeVerificationRequest(user, confirmationCode);

      if (!verificationRequest) {
        return FAILURE<Information>('a verification request corresponding to the specified confirmation code could not be found');
      }

      const { newEmailAddress: emailAddress } = verificationRequest.details as EmailAddressChanged;

      verificationRequest = await this.verificationRequestService
        .createChangeEmailVerificationRequest(user, emailAddress, 'NEW_EMAIL_ADDRESS_NOT_CONFIRMED');

      const token: string = await this.tokenService.createToken(user);

      const confirmationURL: string = this.urlService.formatCompleteEmailAddressChangeConfirmationURL(token, verificationRequest.code);

      const hasSucceeded: boolean = await this.mailService.sendConfirmEmailAddressChange(
        emailAddress,
        confirmationURL
      );

      if (!hasSucceeded) {
        return FAILURE<Information>('the email containing confirmation link could not be sent');
      }

      return SUCCESS<Information>({
        emailAddressChanged: createEmailAddressChanged(verificationRequest)
      });
    } catch (error: unknown) {
      return FAILURE<Information>(error as Error);
    }
  }

  @UseGuards(AuthJwtAuthGuard)
  @Post('complete-email-address-change')
  async completeEmailAddressChange(@Req() req: Request, @Body() {
    confirmationCode
  }: {
    confirmationCode: string;
  }): Promise<Result<Token>> {
    try {
      let user: User = req.user as User;

      const hasAccess: boolean = await this.accessService.checkUserAccess(user, user, AccessAction.UPDATE);

      if (!hasAccess) {
        return FAILURE<Token>('you do not have access to complete the email address');
      }

      let verificationRequest: VerificationRequest | null = await this.verificationRequestService.findVerificationRequestByCode(confirmationCode);

      if (!verificationRequest) {
        return FAILURE<Token>('the verification code with the specified confirmation code could not be found');
      }

      if (verificationRequest.userID !== user._id.toString()) {
        return FAILURE<Token>('the verification request with the specified confirmation code belongs to a different user');
      }

      const {
        newEmailAddress: emailAddress
      } = verificationRequest.details as {
        oldEmailAddress: string;
        newEmailAddress: string
      };

      user = await this.userService.changeEmailAddress(user, emailAddress);

      verificationRequest = await this.verificationRequestService.completeVerificationRequest(user, confirmationCode);

      if (!verificationRequest) {
        return FAILURE<Token>('a verification request corresponding to the specified confirmation code could not be found');
      }

      user = await this.userService.getUserByID(user._id);

      await this.tokenService.invalidateToken(extractSession(req));

      return await this.tokenService.generateToken(user);
    } catch (error: unknown) {
      return FAILURE<Token>(error as Error);
    }
  }

  @UseGuards(AuthJwtAuthGuard)
  @Post('cancel-email-address-change')
  async cancelEmailAddressChange(@Req() req: Request, @Body() {
    confirmationCode
  }: {
    confirmationCode: string;
  }): Promise<Result<Information>> {
    try {
      const user: User = req.user as User;

      const hasAccess: boolean = await this.accessService.checkUserAccess(user, user, AccessAction.UPDATE);

      if (!hasAccess) {
        return FAILURE<Information>('you do not have access to cancel the email address');
      }

      const verificationRequest: VerificationRequest | null = await this.verificationRequestService.cancelVerificationRequest(user, confirmationCode);

      if (!verificationRequest) {
        return FAILURE<Information>('a verification request corresponding to the specified confirmation code could not be found');
      }

      return SUCCESS<Information>({
        emailAddressChanged: null
      });
    } catch (error: unknown) {
      return FAILURE<Information>(error as Error);
    }
  }

  @UseGuards(AuthJwtAuthGuard)
  @Post('resend-email-address-change')
  async resendEmailAddressChange(@Req() req: Request): Promise<Result<Information>> {
    try {
      const user: User = req.user as User;

      const hasAccess: boolean = await this.accessService.checkUserAccess(user, user, AccessAction.UPDATE);

      if (!hasAccess) {
        return FAILURE<Information>('you do not have access to confirm the email address');
      }

      const verificationRequest: VerificationRequest | null = await this.verificationRequestService
        .recreateVerificationRequest(user, VerificationRequestPurpose.CHANGE_EMAIL_ADDRESS);

      if (!verificationRequest) {
        return FAILURE<Information>('a verification request to resend could not be found');
      }

      const emailAddressChanged: EmailAddressChanged = verificationRequest.details as EmailAddressChanged;

      // eslint-disable-next-line @typescript-eslint/no-inferrable-types
      let hasSuccess: boolean = false;

      switch (emailAddressChanged.status) {
        case 'OLD_EMAIL_ADDRESS_NOT_CONFIRMED': {
          const token: string = await this.tokenService.createToken(user);
          const confirmationURL: string = this.urlService.formatConfirmEmailAddressChangeConfirmationURL(token, verificationRequest.code);

          hasSuccess = await this.mailService.sendConfirmEmailAddressChange(emailAddressChanged.oldEmailAddress, confirmationURL);
          break;
        }

        case 'NEW_EMAIL_ADDRESS_NOT_CONFIRMED': {
          const token: string = await this.tokenService.createToken(user);
          const confirmationURL: string = this.urlService.formatCompleteEmailAddressChangeConfirmationURL(token, verificationRequest.code);

          hasSuccess = await this.mailService.sendCompleteEmailAddressChange(emailAddressChanged.newEmailAddress, confirmationURL);
          break;
        }
      }

      if (!hasSuccess) {
        return FAILURE<Information>('an email could not be sent');
      }

      return SUCCESS<Information>({
        emailAddressChanged: createEmailAddressChanged(verificationRequest)
      });
    } catch (error: unknown) {
      return FAILURE<Information>(error as Error);
    }
  }
}
