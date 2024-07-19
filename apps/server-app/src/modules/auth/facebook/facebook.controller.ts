import { Controller, Get, Query, Req, Res, UseGuards } from '@nestjs/common';
import { FAILURE, Result, Session, Token } from '@voltron/common-library';
import { ProviderType, User } from '@voltron/core-library';
import { Request, Response } from 'express';
import { AUTH_CONSTANTS } from '../auth.constants';
import { extractSession } from '../auth.methods';
import { AuthCoreService } from '../core/core.service';
import { AuthTokenService } from '../core/token.service';
import { AuthJwtAuthGuard } from '../jwt/jwt.guard';
import { AuthFacebookAuthGuard } from './facebook.guard';

@Controller('auth')
export class AuthFacebookController {
  constructor(
    private readonly coreService: AuthCoreService,
    private readonly tokenService: AuthTokenService
  ) {
  }

  @UseGuards(AuthFacebookAuthGuard)
  @Get('login/facebook')
  async loginWithFacebook(): Promise<void> {
    // NOTE : do nothing
  }

  @UseGuards(AuthFacebookAuthGuard)
  @Get('connect/facebook')
  async connectFacebook(): Promise<void> {
    // NOTE : do nothing
  }

  @UseGuards(AuthJwtAuthGuard)
  @Get('disconnect/facebook')
  async disconnectFacebook(@Req() req: Request): Promise<Result<Token>> {
    try {
      const session: Session | null = extractSession(req);

      let user: User = req.user as User;

      user = await this.coreService.ensureUserNotWithProvider(user, ProviderType.FACEBOOK);

      return await this.tokenService.regenerateToken(session, user);
    } catch (error: unknown) {
      return FAILURE<Token>(error as Error);
    }
  }

  @UseGuards(AuthFacebookAuthGuard)
  @Get('accept/facebook')
  async acceptFacebook(@Req() req: Request, @Res() res: Response, @Query('state') state: string): Promise<void> {
    const json: string = Buffer
      .from(state, 'base64')
      .toString('utf-8');

    const { path }: { path: string; } = JSON.parse(json) as { path: string; };

    const user: User = req.user as User;

    const token: string = await this.tokenService.createToken(user);

    const redirectURL: URL = new URL('/app/accept/facebook', AUTH_CONSTANTS.Strategies.Facebook.redirectURL);

    redirectURL.searchParams.set('token', token);
    redirectURL.searchParams.set('path', path);

    res.redirect(redirectURL.toString());
  }
}
