import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Result, Token } from '@voltron/common-library';
import { User } from '@voltron/core-library';
import { Request, Response } from 'express';
import { extractSession } from '../auth.methods';
import { AuthTokenService } from '../core/token.service';
import { AuthMagicLoginAuthGuard } from './magic-login.guard';
import { AuthMagicLoginStrategy } from './magic-login.strategy';

@Controller('auth')
export class AuthMagicLoginController {
  constructor(
    private readonly strategy: AuthMagicLoginStrategy,
    private readonly tokenService: AuthTokenService
  ) {
  }

  @Post('login/magic-login')
  async loginWithMagicLogin(@Req() req: Request, @Res() res: Response): Promise<void> {
    this.strategy.send(req, res);
  }

  @UseGuards(AuthMagicLoginAuthGuard)
  @Get('accept/magic-login')
  async acceptMagicLogin(@Req() req: Request): Promise<Result<Token>> {
    await this.tokenService.invalidateToken(extractSession(req));

    return this.tokenService.generateToken(req.user as User);
  }
}
