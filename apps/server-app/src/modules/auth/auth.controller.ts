import { Body, Controller, Get, Inject, Post, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { Result, Session, Token } from '@voltron/common-library';
import { MailService, User, VerificationRequest } from '@voltron/core-library';
import { REDIS_CONSTANTS } from '@voltron/data-library';
import { Request, Response } from 'express';
import { decode } from 'jsonwebtoken';
import { AuthGitHubAuthGuard } from './auth-github.guard';
import { AuthGoogleAuthGuard } from './auth-google.guard';
import { AuthJwtAuthGuard } from './auth-jwt.guard';
import { AuthLocalAuthGuard } from './auth-local.guard';
import { AuthMagicLoginAuthGuard } from './auth-magic-login.guard';
import { AuthStrategyService } from './auth-strategy.service';
import { AuthTokenService } from './auth-token.service';
import { AuthURLService } from './auth-url.service';
import { AuthUserService } from './auth-user.service';
import { AuthVerificationRequestService } from './auth-verification-request.service';
import { AUTH_CONSTANTS } from './auth.constants';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(REDIS_CONSTANTS.Symbols.Services.MailService)
    private readonly mailService: MailService,
    private readonly strategyService: AuthStrategyService,
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

      return {
        success: true,
        data: void 0
      };
    } catch (error: unknown) {
      return {
        success: false,
        error: error as Error
      };
    }
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

  @UseGuards(AuthLocalAuthGuard)
  @Post('login/password')
  async loginWithPassword(@Req() req: Request): Promise<Result<Token>> {
    return await this.tokenService.generateToken(req.user as User);
  }

  @Post('login/magic-login')
  async loginWithMagicLogin(@Req() req: Request, @Res() res: Response): Promise<void> {
    await this.strategyService.sendNotification(req, res);
  }

  @UseGuards(AuthGitHubAuthGuard)
  @Get('login/github')
  async loginWithGitHub(): Promise<void> {
    // TODO : handle login with GitHub
  }

  @UseGuards(AuthGoogleAuthGuard)
  @Get('login/google')
  async loginWithGoogle(): Promise<void> {
    // TODO : handle login with Google
  }

  @UseGuards(AuthJwtAuthGuard)
  @Post('logout')
  async logout(@Req() req: Request, @Res() res: Response): Promise<void> {
    const token: string = req.headers.authorization?.replace(/^Bearer /, '') ?? '';

    if (token) {
      const session: Session = decode(token) as Session;

      await this.tokenService.invalidateToken(session);
    }

    res.status(200).end();
  }

  @UseGuards(AuthMagicLoginAuthGuard)
  @Get('accept/magic-login')
  async acceptMagicLogin(@Req() req: Request): Promise<Result<Token>> {
    return this.tokenService.generateToken(req.user as User);
  }

  @UseGuards(AuthGitHubAuthGuard)
  @Get('accept/github')
  async acceptGitHub(@Req() req: Request, @Res() res: Response): Promise<void> {
    const result: Result<Token> = await this.tokenService.generateToken(req.user as User);

    if (result.success) {
      const redirectURL: URL = new URL('/app/accept/github', AUTH_CONSTANTS.Strategies.GitHub.redirectURL);

      redirectURL.searchParams.set('token', result.data.token);

      res.redirect(redirectURL.toString());
    } else {
      const redirectURL: URL = new URL('/app/login', AUTH_CONSTANTS.Strategies.GitHub.redirectURL);

      res.redirect(redirectURL.toString());
    }
  }

  @UseGuards(AuthGoogleAuthGuard)
  @Get('accept/google')
  async acceptGoogle(@Req() req: Request, @Res() res: Response): Promise<void> {
    const result: Result<Token> = await this.tokenService.generateToken(req.user as User);

    if (result.success) {
      const redirectURL: URL = new URL('/app/accept/google', AUTH_CONSTANTS.Strategies.Google.redirectURL);

      redirectURL.searchParams.set('token', result.data.token);

      res.redirect(redirectURL.toString());
    } else {
      const redirectURL: URL = new URL('/app/login', AUTH_CONSTANTS.Strategies.Google.redirectURL);

      res.redirect(redirectURL.toString());
    }
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

    return await this.tokenService.generateToken(user);
  }

  @Post('activate-account')
  async activateAccount(@Body() {
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

      return await this.tokenService.generateToken(user);
    } catch (error: unknown) {
      return {
        success: false,
        error: new UnauthorizedException(error as Error)
      };
    }
  }

  @Post('recover-account')
  async recoverAccount(@Body() {
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

    return await this.tokenService.generateToken(user);
  }
}
