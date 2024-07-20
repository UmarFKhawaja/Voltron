import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { FAILURE, Result, Session, Token } from '@voltron/common-library';
import { User } from '@voltron/core-library';
import { Request, Response } from 'express';
import { extractSession } from '../auth.methods';
import { AuthTokenService } from '../core/token.service';
import { AuthMagicLoginStrategyService } from './magic-login-strategy.service';
import { AuthMagicLoginAuthGuard } from './magic-login.guard';

@Controller('auth')
export class AuthMagicLoginController {
  constructor(
    private readonly strategyService: AuthMagicLoginStrategyService,
    private readonly tokenService: AuthTokenService
  ) {
  }

  @Post('login/magic-login')
  async loginWithMagicLogin(@Req() req: Request, @Res() res: Response): Promise<void> {
    this.strategyService.send(req, res);
  }

  @UseGuards(AuthMagicLoginAuthGuard)
  @Get('accept/magic-login')
  async acceptMagicLogin(@Req() req: Request): Promise<Result<Token>> {
    try {
      const session: Session | null = extractSession(req);

      const user: User | null = req.user as User;

      return await this.tokenService.regenerateToken(session, user);
    } catch (error: unknown) {
      return FAILURE<Token>(error as Error);
    }
  }
}
