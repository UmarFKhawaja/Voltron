import { Controller, Get, Query, Req, Res, UseGuards } from '@nestjs/common';
import { FAILURE, Result, Session, Token } from '@voltron/common-library';
import { ProviderType, User } from '@voltron/core-library';
import { Request, Response } from 'express';
import { AUTH_CONSTANTS } from '../auth.constants';
import { extractSession } from '../auth.methods';
import { AuthCoreService } from '../core/core.service';
import { AuthTokenService } from '../core/token.service';
import { AuthJwtAuthGuard } from '../jwt/jwt.guard';
import { AuthGoogleAuthGuard } from './google.guard';

@Controller('auth')
export class AuthGoogleController {
  constructor(
    private readonly coreService: AuthCoreService,
    private readonly tokenService: AuthTokenService
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
    try {
      const session: Session | null = extractSession(req);

      let user: User = req.user as User;

      user = await this.coreService.ensureUserNotWithProvider(user, ProviderType.GOOGLE);

      return await this.tokenService.regenerateToken(session, user);
    } catch (error: unknown) {
      return FAILURE<Token>(error as Error);
    }
  }

  @UseGuards(AuthGoogleAuthGuard)
  @Get('accept/google')
  async acceptGoogle(@Req() req: Request, @Res() res: Response, @Query('state') state: string): Promise<void> {
    const json: string = Buffer
      .from(state, 'base64')
      .toString('utf-8');

    const { path }: { path: string; } = JSON.parse(json) as { path: string; };

    const user: User = req.user as User;

    const token: string = await this.tokenService.createToken(user);

    const redirectURL: URL = new URL('/app/accept/google', AUTH_CONSTANTS.Strategies.Google.redirectURL);

    redirectURL.searchParams.set('token', token);
    redirectURL.searchParams.set('path', path);

    res.redirect(redirectURL.toString());
  }
}
