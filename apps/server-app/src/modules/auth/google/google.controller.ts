import { Controller, Get, Query, Req, Res, UseGuards } from '@nestjs/common';
import { Result, Token } from '@voltron/common-library';
import { ProviderType, User } from '@voltron/core-library';
import { Request, Response } from 'express';
import { AUTH_CONSTANTS } from '../auth.constants';
import { extractSession } from '../auth.methods';
import { AuthTokenService } from '../core/token.service';
import { AuthUserService } from '../core/user.service';
import { AuthJwtAuthGuard } from '../jwt/jwt.guard';
import { AuthGoogleAuthGuard } from './google.guard';

@Controller('auth')
export class AuthGoogleController {
  constructor(
    private readonly tokenService: AuthTokenService,
    private readonly userService: AuthUserService
  ) {
  }

  @UseGuards(AuthGoogleAuthGuard)
  @Get('login/google')
  async loginWithGoogle(): Promise<void> {
    // NOTE : do nothing
  }

  @UseGuards(AuthGoogleAuthGuard)
  @Get('connect/google')
  async connectGoogle(): Promise<void> {
    // NOTE : do nothing
  }

  @UseGuards(AuthJwtAuthGuard)
  @Get('disconnect/google')
  async disconnectGoogle(@Req() req: Request): Promise<Result<Token>> {
    const user: User = await this.userService.ensureUserNotWithProvider(req.user as User, ProviderType.GOOGLE);

    await this.tokenService.invalidateToken(extractSession(req));

    return await this.tokenService.generateToken(user);
  }

  @UseGuards(AuthGoogleAuthGuard)
  @Get('accept/google')
  async acceptGoogle(@Req() req: Request, @Res() res: Response, @Query('state') state: string): Promise<void> {
    const json: string = Buffer
      .from(state, 'base64')
      .toString('utf-8');

    const { path }: { path: string; } = JSON.parse(json) as { path: string; };

    await this.tokenService.invalidateToken(extractSession(req));

    const result: Result<Token> = await this.tokenService.generateToken(req.user as User);

    if (result.success) {
      const redirectURL: URL = new URL('/app/accept/google', AUTH_CONSTANTS.Strategies.Google.redirectURL);

      redirectURL.searchParams.set('token', result.data.token);
      redirectURL.searchParams.set('path', path);

      res.redirect(redirectURL.toString());
    } else {
      const redirectURL: URL = new URL('/app/login', AUTH_CONSTANTS.Strategies.Google.redirectURL);

      res.redirect(redirectURL.toString());
    }
  }
}
