import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Result, Token } from '@voltron/common-library';
import { ProviderType, User } from '@voltron/core-library';
import { Request, Response } from 'express';
import { AUTH_CONSTANTS } from '../auth.constants';
import { extractSession } from '../auth.methods';
import { AuthTokenService } from '../core/token.service';
import { AuthUserService } from '../core/user.service';
import { AuthJwtAuthGuard } from '../jwt/jwt.guard';
import { AuthFacebookAuthGuard } from './facebook.guard';

@Controller('auth')
export class AuthFacebookController {
  constructor(
    private readonly tokenService: AuthTokenService,
    private readonly userService: AuthUserService
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
    const user: User = await this.userService.ensureUserNotWithProvider(req.user as User, ProviderType.FACEBOOK);

    await this.tokenService.invalidateToken(extractSession(req));

    return await this.tokenService.generateToken(user);
  }

  @UseGuards(AuthFacebookAuthGuard)
  @Get('accept/facebook')
  async acceptFacebook(@Req() req: Request, @Res() res: Response): Promise<void> {
    await this.tokenService.invalidateToken(extractSession(req));

    const result: Result<Token> = await this.tokenService.generateToken(req.user as User);

    if (result.success) {
      const redirectURL: URL = new URL('/app/accept/facebook', AUTH_CONSTANTS.Strategies.Facebook.redirectURL);

      redirectURL.searchParams.set('token', result.data.token);

      res.redirect(redirectURL.toString());
    } else {
      const redirectURL: URL = new URL('/app/login', AUTH_CONSTANTS.Strategies.Facebook.redirectURL);

      res.redirect(redirectURL.toString());
    }
  }
}
