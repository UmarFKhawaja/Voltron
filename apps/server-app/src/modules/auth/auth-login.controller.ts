import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Result, Token } from '@voltron/common-library';
import { User } from '@voltron/core-library';
import { Request, Response } from 'express';
import { AuthFacebookAuthGuard } from './auth-facebook.guard';
import { AuthGoogleAuthGuard } from './auth-google.guard';
import { AuthLocalAuthGuard } from './auth-local.guard';
import { AuthStrategyService } from './auth-strategy.service';
import { AuthTokenService } from './auth-token.service';
import { extractSession } from './auth.methods';

@Controller('auth/login')
export class AuthLoginController {
  constructor(
    private readonly strategyService: AuthStrategyService,
    private readonly tokenService: AuthTokenService
  ) {
  }

  @UseGuards(AuthLocalAuthGuard)
  @Post('password')
  async loginWithPassword(@Req() req: Request): Promise<Result<Token>> {
    await this.tokenService.invalidateToken(extractSession(req));

    return await this.tokenService.generateToken(req.user as User);
  }

  @Post('magic-login')
  async loginWithMagicLogin(@Req() req: Request, @Res() res: Response): Promise<void> {
    await this.strategyService.sendNotification(req, res);
  }

  @UseGuards(AuthFacebookAuthGuard)
  @Get('facebook')
  async loginWithFacebook(): Promise<void> {
    // NOTE : do nothing
  }

  @UseGuards(AuthGoogleAuthGuard)
  @Get('google')
  async loginWithGoogle(): Promise<void> {
    // NOTE : do nothing
  }
}
