import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Result, Token, User } from '@voltron/common-library';
import { Request, Response } from 'express';
import { AuthLocalAuthGuard } from './auth-local.guard';
import { AuthStrategyService } from './auth-strategy.service';
import { AuthTokenService } from './auth-token.service';
import { AuthUserService } from './auth-user.service';

@Controller('auth/login')
export class AuthLoginController {
  constructor(
    private readonly strategyService: AuthStrategyService,
    private readonly tokenService: AuthTokenService,
    private readonly userService: AuthUserService
  ) {
  }

  @UseGuards(AuthLocalAuthGuard)
  @Post('password')
  async password(@Req() req: Request): Promise<Result<Token>> {
    return this.tokenService.generateToken(req.user as User);
  }

  @Post('magic-login')
  async magicLogin(@Req() req: Request, @Res() res: Response, @Body() body: { destination: string }): Promise<void> {
    await this.strategyService.sendNotification(req, res);
  }
}