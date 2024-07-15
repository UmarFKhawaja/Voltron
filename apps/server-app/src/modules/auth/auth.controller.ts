import { Body, Controller, Get, Inject, Logger, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { EmailAddressChanged, Information, Result, Token } from '@voltron/common-library';
import { MailService, User, VerificationRequest, VerificationRequestPurpose } from '@voltron/core-library';
import { REDIS_CONSTANTS } from '@voltron/data-library';
import { Request } from 'express';
import { AuthJwtAuthGuard } from './auth-jwt.guard';
import { AuthTokenService } from './auth-token.service';
import { AuthURLService } from './auth-url.service';
import { AuthUserService } from './auth-user.service';
import { AuthVerificationRequestService } from './auth-verification-request.service';
import { createEmailAddressChanged, extractSession, extractToken } from './auth.methods';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(REDIS_CONSTANTS.Symbols.Services.MailService)
    private readonly mailService: MailService,
    private readonly tokenService: AuthTokenService,
    private readonly urlService: AuthURLService,
    private readonly userService: AuthUserService,
    private readonly verificationRequestService: AuthVerificationRequestService
  ) {
  }

  @Post('request-activation-code')
  async requestActivationCode(@Body() {
    username
  }: {
    username: string;
  }): Promise<Result<void>> {
    const user: User | null = await this.userService.findUserByUsername(username);

    if (!user) {
      return {
        success: false,
        error: {
          message: 'a user with the specified username could not be found'
        }
      };
    }

    if (user.verifiedAt) {
      return {
        success: false,
        error: {
          message: 'the user with the specified username is already activated'
        }
      };
    }

    const verificationRequest: VerificationRequest = await this.verificationRequestService.createRegisterVerificationRequest(user);

    const verificationURL: string = this.urlService.formatRegisterVerificationURL(verificationRequest);

    await this.mailService.sendRegisterMail(user.emailAddress, verificationURL);

    return {
      success: true,
      data: void 0
    };
  }

  @UseGuards(AuthJwtAuthGuard)
  @Get('verify-session')
  async verifySession(): Promise<Result<boolean>> {
    return {
      success: true,
      data: true
    };
  }

  @UseGuards(AuthJwtAuthGuard)
  @Get('get-information')
  async getInformation(@Req() req: Request): Promise<Result<Information>> {
    const verificationRequest: VerificationRequest | null = await this.verificationRequestService
      .findVerificationRequestByUserAndPurpose(req.user as User, VerificationRequestPurpose.CHANGE_EMAIL_ADDRESS);

    const information: Information = {
      emailAddressChanged: createEmailAddressChanged(verificationRequest)
    };

    return {
      success: true,
      data: information
    };
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
    let user: User | null = req.user as User;

    user = await this.userService.updateUser(user, displayName, userName);

    await this.tokenService.invalidateToken(extractSession(req));

    return await this.tokenService.generateToken(user);
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
        return {
          success: false,
          error: new UnauthorizedException(
            new Error('a user with the specified ID could not be found')
          )
        };
      }

      if (!user.verifiedAt) {
        return {
          success: false,
          error: new UnauthorizedException(
            new Error('the user with the specified user ID is not verified')
          )
        };
      }

      await this.tokenService.invalidateToken(extractSession(req));

      return await this.tokenService.generateToken(user);
    } catch (error: unknown) {
      return {
        success: false,
        error: new UnauthorizedException(error as Error)
      };
    }
  }

  @Post('recover-account')
  async recoverAccount(@Req() req: Request, @Body() {
    username
  }: {
    username: string;
  }): Promise<Result<void>> {
    const user: User | null = await this.userService.findUserByUsername(username);

    if (!user) {
      return {
        success: true,
        data: void 0
      };
    }

    await this.tokenService.invalidateToken(extractSession(req));

    const result: Result<Token> = await this.tokenService.generateToken(user);

    if (!result.success) {
      return result;
    }

    const confirmationURL: string = this.urlService.formatRecoverAccountConfirmationURL(result.data.token);

    await this.mailService.sendResetPasswordMail(user.emailAddress, confirmationURL);

    return {
      success: true,
      data: void 0
    };
  }

  @UseGuards(AuthJwtAuthGuard)
  @Get('reset-password')
  async resetPassword(@Req() req: Request): Promise<Result<Token>> {
    let user: User | null = req.user as User;

    user = await this.userService.resetPassword(user);

    await this.tokenService.invalidateToken(extractSession(req));

    return await this.tokenService.generateToken(user);
  }

  @UseGuards(AuthJwtAuthGuard)
  @Post('start-email-address-change')
  async startEmailAddressChange(@Req() req: Request, @Body() {
    emailAddress
  }: {
    emailAddress: string;
  }): Promise<Result<Information>> {
    try {
      const token: string = extractToken(req);

      const user: User | null = req.user as User;

      const verificationRequest: VerificationRequest = await this.verificationRequestService
        .createChangeEmailVerificationRequest(user, emailAddress, 'OLD_EMAIL_ADDRESS_NOT_CONFIRMED');

      const confirmationURL: string = this.urlService.formatConfirmEmailAddressChangeConfirmationURL(token, verificationRequest.code);

      const hasSucceeded: boolean = await this.mailService.sendConfirmEmailAddressChange(
        user.emailAddress,
        confirmationURL
      );

      if (hasSucceeded) {
        return {
          success: true,
          data: {
            emailAddressChanged: createEmailAddressChanged(verificationRequest)
          }
        };
      } else {
        return {
          success: false,
          error: {
            message: 'the email containing confirmation link could not be sent'
          }
        };
      }
    } catch (error: unknown) {
      return {
        success: false,
        error: {
          message: (error as Error).message
        }
      };
    }
  }

  @UseGuards(AuthJwtAuthGuard)
  @Post('confirm-email-address-change')
  async confirmEmailAddressChange(@Req() req: Request, @Body() {
    confirmationCode
  }: {
    confirmationCode: string;
  }): Promise<Result<Information>> {
    const user: User | null = req.user as User;

    let verificationRequest: VerificationRequest | null = await this.verificationRequestService.completeVerificationRequest(user, confirmationCode);

    if (!verificationRequest) {
      return {
        success: false,
        error: {
          message: 'a verification request corresponding to the specified confirmation code could not be found'
        }
      };
    }

    const { newEmailAddress: emailAddress } = verificationRequest.details as EmailAddressChanged;

    verificationRequest = await this.verificationRequestService
      .createChangeEmailVerificationRequest(user, emailAddress, 'NEW_EMAIL_ADDRESS_NOT_CONFIRMED');

    const result: Result<Token> = await this.tokenService.generateToken(user);

    if (!result.success) {
      return {
        success: false,
        error: {
          message: 'a token could not be generated'
        }
      };
    }

    const token: string = result.data.token;

    const confirmationURL: string = this.urlService.formatCompleteEmailAddressChangeConfirmationURL(token, verificationRequest.code);

    const hasSucceeded: boolean = await this.mailService.sendConfirmEmailAddressChange(
      emailAddress,
      confirmationURL
    );

    if (hasSucceeded) {
      return {
        success: true,
        data: {
          emailAddressChanged: createEmailAddressChanged(verificationRequest)
        }
      };
    } else {
      return {
        success: false,
        error: {
          message: 'the email containing confirmation link could not be sent'
        }
      };
    }
  }

  @UseGuards(AuthJwtAuthGuard)
  @Post('complete-email-address-change')
  async completeEmailAddressChange(@Req() req: Request, @Body() {
    confirmationCode
  }: {
    confirmationCode: string;
  }): Promise<Result<Token>> {
    let user: User | null = req.user as User;

    let verificationRequest: VerificationRequest | null = await this.verificationRequestService.findVerificationRequestByCode(confirmationCode);

    if (!verificationRequest) {
      return {
        success: false,
        error: {
          message: 'the verification code with the specified confirmation code could not be found'
        }
      };
    }

    if (verificationRequest.userID !== user._id.toString()) {
      return {
        success: false,
        error: {
          message: 'the verification request with the specified confirmation code belongs to a different user'
        }
      };
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
      return {
        success: false,
        error: {
          message: 'a verification request corresponding to the specified confirmation code could not be found'
        }
      };
    }

    return await this.tokenService.generateToken(user);
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

      const verificationRequest: VerificationRequest | null = await this.verificationRequestService.cancelVerificationRequest(user, confirmationCode);

      if (!verificationRequest) {
        return {
          success: false,
          error: {
            message: 'a verification request corresponding to the specified confirmation code could not be found'
          }
        };
      }

      return {
        success: true,
        data: {
          emailAddressChanged: null
        }
      };
    } catch (error: unknown) {
      return {
        success: false,
        error: {
          message: (error as Error).message
        }
      };
    }
  }

  @UseGuards(AuthJwtAuthGuard)
  @Post('change-password')
  async changePassword(@Req() req: Request, @Body() {
    oldPassword,
    newPassword
  }: {
    oldPassword: string;
    newPassword: string;
  }): Promise<Result<Token>> {
    try {
      let user: User | null = req.user as User;

      user = await this.userService.changePassword(user, oldPassword, newPassword);

      await this.tokenService.invalidateToken(extractSession(req));

      return await this.tokenService.generateToken(user);
    } catch (error: unknown) {
      return {
        success: false,
        error: {
          message: (error as Error).message
        }
      };
    }
  }

  @UseGuards(AuthJwtAuthGuard)
  @Post('set-password')
  async setPassword(@Req() req: Request, @Body() {
    newPassword
  }: {
    newPassword: string;
  }): Promise<Result<Token>> {
    let user: User | null = req.user as User;

    user = await this.userService.setPassword(user, newPassword);

    await this.tokenService.invalidateToken(extractSession(req));

    return await this.tokenService.generateToken(user);
  }

  @UseGuards(AuthJwtAuthGuard)
  @Post('unset-password')
  async unsetPassword(@Req() req: Request, @Body() {
    oldPassword
  }: {
    oldPassword: string;
  }): Promise<Result<Token>> {
    let user: User | null = req.user as User;

    user = await this.userService.unsetPassword(user, oldPassword);

    await this.tokenService.invalidateToken(extractSession(req));

    return await this.tokenService.generateToken(user);
  }

  @UseGuards(AuthJwtAuthGuard)
  @Post('resend-email-address-change')
  async resendEmailAddressChange(@Req() req: Request): Promise<Result<Information>> {
    try {
      const user: User = req.user as User;

      let verificationRequest: VerificationRequest | null = await this.verificationRequestService
        .recreateVerificationRequest(user, VerificationRequestPurpose.CHANGE_EMAIL_ADDRESS);

      if (!verificationRequest) {
        return {
          success: false,
          error: {
            message: 'a verification request to resend could not be found'
          }
        };
      }

      const emailAddressChanged: EmailAddressChanged = verificationRequest.details as EmailAddressChanged;

      let isSuccess: boolean = false;

      switch (emailAddressChanged.status) {
        case 'OLD_EMAIL_ADDRESS_NOT_CONFIRMED': {
          const token: string = extractToken(req);
          const confirmationURL: string = this.urlService.formatConfirmEmailAddressChangeConfirmationURL(token, verificationRequest.code);

          isSuccess = await this.mailService.sendConfirmEmailAddressChange(emailAddressChanged.oldEmailAddress, confirmationURL);
          break;
        }

        case 'NEW_EMAIL_ADDRESS_NOT_CONFIRMED': {
          const token: string = extractToken(req);
          const confirmationURL: string = this.urlService.formatCompleteEmailAddressChangeConfirmationURL(token, verificationRequest.code);

          isSuccess = await this.mailService.sendCompleteEmailAddressChange(emailAddressChanged.newEmailAddress, confirmationURL);
          break;
        }
      }

      if (isSuccess) {
        return {
          success: true,
          data: {
            emailAddressChanged: createEmailAddressChanged(verificationRequest)
          }
        };
      } else {
        return {
          success: false,
          error: {
            message: 'an email could not be sent'
          }
        };
      }
    } catch (error: unknown) {
      return {
        success: false,
        error: {
          message: (error as Error).message
        }
      };
    }
  }
}
