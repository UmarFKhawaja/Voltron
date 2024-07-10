import { Body, Controller, Get, Inject, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { Result, Token } from '@voltron/common-library';
import { MailService, User, VerificationRequest } from '@voltron/core-library';
import { REDIS_CONSTANTS } from '@voltron/data-library';
import { Request } from 'express';
import { AuthJwtAuthGuard } from './auth-jwt.guard';
import { AuthTokenService } from './auth-token.service';
import { AuthURLService } from './auth-url.service';
import { AuthUserService } from './auth-user.service';
import { AuthVerificationRequestService } from './auth-verification-request.service';
import { extractSession } from './auth.methods';

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
  async verifySession(): Promise<boolean> {
    return true;
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
      const verificationRequest: VerificationRequest = await this.verificationRequestService.completeVerificationRequest(activationCode);

      let user: User | null = await this.userService.getUserByID(verificationRequest.userID);

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
  @Post('change-password')
  async changePassword(@Req() req: Request, @Body() {
    oldPassword,
    newPassword
  }: {
    oldPassword: string;
    newPassword: string;
  }): Promise<Result<Token>> {
    let user: User | null = req.user as User;

    user = await this.userService.changePassword(user, oldPassword, newPassword);

    await this.tokenService.invalidateToken(extractSession(req));

    return await this.tokenService.generateToken(user);
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
}
