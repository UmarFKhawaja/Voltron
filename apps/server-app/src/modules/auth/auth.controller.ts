import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Result, Session, Token } from '@voltron/common-library';
import { User } from '@voltron/core-library';
import { Request, Response } from 'express';
import { decode } from 'jsonwebtoken';
import { AuthJwtAuthGuard } from './auth-jwt.guard';
import { AuthLocalAuthGuard } from './auth-local.guard';
import { AuthMagicLoginAuthGuard } from './auth-magic-login.guard';
import { AuthStrategyService } from './auth-strategy.service';
import { AuthTokenService } from './auth-token.service';
import { AuthUserService } from './auth-user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly strategyService: AuthStrategyService,
    private readonly tokenService: AuthTokenService,
    private readonly userService: AuthUserService
  ) {
  }

  @Post('register')
  async post(@Req() req: Request, @Res() res: Response, @Body() {
    displayName,
    userName,
    emailAddress,
    password
  }: {
    displayName: string,
    userName: string,
    emailAddress: string,
    password: string
  }): Promise<void> {
    const user: User = await this.userService.registerUser(displayName, userName, emailAddress, password);

    res.json({
      success: true
    });
  }

  @UseGuards(AuthLocalAuthGuard)
  @Post('login/password')
  async loginWithPassword(@Req() req: Request): Promise<Result<Token>> {
    return this.tokenService.generateToken(req.user as User);
  }

  @Post('login/magic-login')
  async loginWithMagicLogin(@Req() req: Request, @Res() res: Response, @Body() body: {
    destination: string
  }): Promise<void> {
    await this.strategyService.sendNotification(req, res);
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

  @UseGuards(AuthJwtAuthGuard)
  @Get('verify/session')
  async verifySession(): Promise<boolean> {
    return true;
  }
}
