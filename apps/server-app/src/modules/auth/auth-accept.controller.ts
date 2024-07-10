import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Result, Token } from '@voltron/common-library';
import { User } from '@voltron/core-library';
import { Request, Response } from 'express';
import { AuthFacebookAuthGuard } from './auth-facebook.guard';
import { AuthGoogleAuthGuard } from './auth-google.guard';
import { AuthMagicLoginAuthGuard } from './auth-magic-login.guard';
import { AuthTokenService } from './auth-token.service';
import { AUTH_CONSTANTS } from './auth.constants';
import { extractSession } from './auth.methods';

@Controller('auth/accept')
export class AuthAcceptController {
  constructor(
    private readonly tokenService: AuthTokenService
  ) {
  }

  @UseGuards(AuthMagicLoginAuthGuard)
  @Get('magic-login')
  async acceptMagicLogin(@Req() req: Request): Promise<Result<Token>> {
    await this.tokenService.invalidateToken(extractSession(req));

    return this.tokenService.generateToken(req.user as User);
  }

  @UseGuards(AuthFacebookAuthGuard)
  @Get('facebook')
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

  @UseGuards(AuthGoogleAuthGuard)
  @Get('google')
  async acceptGoogle(@Req() req: Request, @Res() res: Response): Promise<void> {
    await this.tokenService.invalidateToken(extractSession(req));

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
}
