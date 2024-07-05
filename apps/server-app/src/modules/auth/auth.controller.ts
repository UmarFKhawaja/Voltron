import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Result, Session, Token } from '@voltron/common-library';
import { User } from '@voltron/core-library';
import { Request, Response } from 'express';
import { decode } from 'jsonwebtoken';
import { AuthGitHubAuthGuard } from './auth-github.guard';
import { AuthGoogleAuthGuard } from './auth-google.guard';
import { AuthJwtAuthGuard } from './auth-jwt.guard';
import { AuthLocalAuthGuard } from './auth-local.guard';
import { AuthMagicLoginAuthGuard } from './auth-magic-login.guard';
import { AuthStrategyService } from './auth-strategy.service';
import { AuthTokenService } from './auth-token.service';
import { AuthUserService } from './auth-user.service';
import { GITHUB_CONSTANTS, GOOGLE_CONSTANTS } from './auth.constants';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly strategyService: AuthStrategyService,
    private readonly tokenService: AuthTokenService,
    private readonly userService: AuthUserService
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
  }

  @UseGuards(AuthGoogleAuthGuard)
  @Get('login/google')
  async loginWithGoogle(): Promise<void> {
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
      const redirectURL: URL = new URL('/app/accept/github', GITHUB_CONSTANTS.redirectURL);

      redirectURL.searchParams.set('token', result.data.access_token);

      res.redirect(redirectURL.toString());
    } else {
      const redirectURL: URL = new URL('/app/login', GITHUB_CONSTANTS.redirectURL);

      res.redirect(redirectURL.toString());
    }
  }

  @UseGuards(AuthGoogleAuthGuard)
  @Get('accept/google')
  async acceptGoogle(@Req() req: Request, @Res() res: Response): Promise<void> {
    const result: Result<Token> = await this.tokenService.generateToken(req.user as User);

    if (result.success) {
      const redirectURL: URL = new URL('/app/accept/google', GOOGLE_CONSTANTS.redirectURL);

      redirectURL.searchParams.set('token', result.data.access_token);

      res.redirect(redirectURL.toString());
    } else {
      const redirectURL: URL = new URL('/app/login', GOOGLE_CONSTANTS.redirectURL);

      res.redirect(redirectURL.toString());
    }
  }

  @UseGuards(AuthJwtAuthGuard)
  @Get('verify/session')
  async verifySession(): Promise<boolean> {
    return true;
  }

  @UseGuards(AuthJwtAuthGuard)
  @Post('update/profile')
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
}
