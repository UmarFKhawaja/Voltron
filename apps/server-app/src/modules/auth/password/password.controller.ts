import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { FAILURE, Result, Session, SUCCESS, Token } from '@voltron/common-library';
import { User } from '@voltron/core-library';
import { Request } from 'express';
import { extractSession } from '../auth.methods';
import { AuthCoreService } from '../core/core.service';
import { AuthTokenService } from '../core/token.service';
import { AuthJwtAuthGuard } from '../jwt/jwt.guard';
import { AuthPasswordAuthGuard } from './password.guard';

@Controller('auth')
export class AuthPasswordController {
  constructor(
    private readonly coreService: AuthCoreService,
    private readonly tokenService: AuthTokenService
  ) {
  }

  @UseGuards(AuthPasswordAuthGuard)
  @Post('login/password')
  async loginWithPassword(@Req() req: Request): Promise<Result<Token>> {
    try {
      const session: Session | null = extractSession(req);

      const user: User = req.user as User;

      return await this.tokenService.regenerateToken(session, user);
    } catch (error: unknown) {
      return FAILURE<Token>(error as Error);
    }
  }

  @Post('recover-account')
  async recoverAccount(@Req() req: Request, @Body() {
    username
  }: {
    username: string;
  }): Promise<Result<void>> {
    try {
      await this.coreService.recoverAccount(username);

      return SUCCESS<void>(void 0);
    } catch (error: unknown) {
      return FAILURE<void>(error as Error);
    }
  }

  @UseGuards(AuthJwtAuthGuard)
  @Get('reset-password')
  async resetPassword(@Req() req: Request): Promise<Result<Token>> {
    try {
      const session: Session | null = extractSession(req);

      let user: User | null = req.user as User;

      user = await this.coreService.resetPassword(user);

      return await this.tokenService.regenerateToken(session, user);
    } catch (error: unknown) {
      return FAILURE<Token>(error as Error);
    }
  }

  @UseGuards(AuthJwtAuthGuard)
  @Post('change-password')
  async changePassword(@Req() req: Request, @Body() {
    oldPassword,
    newPassword
  }: {
    oldPassword: string;
    newPassword: string;
  }): Promise<Result<Token>> {
    try {
      const session: Session | null = extractSession(req);

      let user: User | null = req.user as User;

      user = await this.coreService.changePassword(user, oldPassword, newPassword);

      return await this.tokenService.regenerateToken(session, user);
    } catch (error: unknown) {
      return FAILURE<Token>(error as Error);
    }
  }

  @UseGuards(AuthJwtAuthGuard)
  @Post('set-password')
  async setPassword(@Req() req: Request, @Body() {
    newPassword
  }: {
    newPassword: string;
  }): Promise<Result<Token>> {
    try {
      const session: Session | null = extractSession(req);

      let user: User | null = req.user as User;

      user = await this.coreService.setPassword(user, newPassword);

      return await this.tokenService.regenerateToken(session, user);
    } catch (error: unknown) {
      return FAILURE<Token>(error as Error);
    }
  }

  @UseGuards(AuthJwtAuthGuard)
  @Post('unset-password')
  async unsetPassword(@Req() req: Request, @Body() {
    oldPassword
  }: {
    oldPassword: string;
  }): Promise<Result<Token>> {
    try {
      const session: Session | null = extractSession(req);

      let user: User | null = req.user as User;

      user = await this.coreService.unsetPassword(user, oldPassword);

      return await this.tokenService.regenerateToken(session, user);
    } catch (error: unknown) {
      return FAILURE<Token>(error as Error);
    }
  }
}
