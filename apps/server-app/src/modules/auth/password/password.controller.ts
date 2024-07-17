import { Body, Controller, Get, Inject, Post, Req, UseGuards } from '@nestjs/common';
import { Result, Token } from '@voltron/common-library';
import { MailService, User } from '@voltron/core-library';
import { REDIS_CONSTANTS } from '@voltron/data-library';
import { Request } from 'express';
import { extractSession } from '../auth.methods';
import { AuthTokenService } from '../core/token.service';
import { AuthURLService } from '../core/url.service';
import { AuthUserService } from '../core/user.service';
import { AuthJwtAuthGuard } from '../jwt/jwt.guard';
import { AuthPasswordAuthGuard } from './password.guard';

@Controller('auth')
export class AuthPasswordController {
  constructor(
    @Inject(REDIS_CONSTANTS.Symbols.Services.MailService)
    private readonly mailService: MailService,
    private readonly tokenService: AuthTokenService,
    private readonly urlService: AuthURLService,
    private readonly userService: AuthUserService
  ) {
  }

  @UseGuards(AuthPasswordAuthGuard)
  @Post('login/password')
  async loginWithPassword(@Req() req: Request): Promise<Result<Token>> {
    await this.tokenService.invalidateToken(extractSession(req));

    return await this.tokenService.generateToken(req.user as User);
  }

  @Post('recover-account')
  async recoverAccount(@Req() req: Request, @Body() {
    username
  }: {
    username: string;
  }): Promise<Result<void>> {
    const user: User | null = await this.userService.findUserByUsername(username);

    if (!user) {
      return {
        success: true,
        data: void 0
      };
    }

    await this.tokenService.invalidateToken(extractSession(req));

    const result: Result<Token> = await this.tokenService.generateToken(user);

    if (!result.success) {
      return result;
    }

    const confirmationURL: string = this.urlService.formatRecoverAccountConfirmationURL(result.data.token);

    await this.mailService.sendResetPasswordMail(user.emailAddress, confirmationURL);

    return {
      success: true,
      data: void 0
    };
  }

  @UseGuards(AuthJwtAuthGuard)
  @Get('reset-password')
  async resetPassword(@Req() req: Request): Promise<Result<Token>> {
    let user: User | null = req.user as User;

    user = await this.userService.resetPassword(user);

    await this.tokenService.invalidateToken(extractSession(req));

    return await this.tokenService.generateToken(user);
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
      let user: User | null = req.user as User;

      user = await this.userService.changePassword(user, oldPassword, newPassword);

      await this.tokenService.invalidateToken(extractSession(req));

      return await this.tokenService.generateToken(user);
    } catch (error: unknown) {
      return {
        success: false,
        error: {
          message: (error as Error).message
        }
      };
    }
  }

  @UseGuards(AuthJwtAuthGuard)
  @Post('set-password')
  async setPassword(@Req() req: Request, @Body() {
    newPassword
  }: {
    newPassword: string;
  }): Promise<Result<Token>> {
    let user: User | null = req.user as User;

    user = await this.userService.setPassword(user, newPassword);

    await this.tokenService.invalidateToken(extractSession(req));

    return await this.tokenService.generateToken(user);
  }

  @UseGuards(AuthJwtAuthGuard)
  @Post('unset-password')
  async unsetPassword(@Req() req: Request, @Body() {
    oldPassword
  }: {
    oldPassword: string;
  }): Promise<Result<Token>> {
    let user: User | null = req.user as User;

    user = await this.userService.unsetPassword(user, oldPassword);

    await this.tokenService.invalidateToken(extractSession(req));

    return await this.tokenService.generateToken(user);
  }
}
