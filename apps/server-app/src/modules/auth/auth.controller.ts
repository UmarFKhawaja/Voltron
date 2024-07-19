import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { FAILURE, Information, Result, Session, SUCCESS, Token } from '@voltron/common-library';
import { User } from '@voltron/core-library';
import { Request, Response } from 'express';
import { extractSession } from './auth.methods';
import { AuthCoreService } from './core/core.service';
import { AuthTokenService } from './core/token.service';
import { AuthJwtAuthGuard } from './jwt/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly coreService: AuthCoreService,
    private readonly tokenService: AuthTokenService
  ) {
  }

  @Post('register')
  async post(@Body() {
    displayName,
    userName,
    emailAddress,
    password
  }: {
    displayName: string,
    userName: string,
    emailAddress: string,
    password: string
  }): Promise<Result<void>> {
    try {
      await this.coreService.register(displayName, userName, emailAddress, password);

      return SUCCESS<void>(void 0);
    } catch (error: unknown) {
      return FAILURE<void>(error as Error);
    }
  }

  @Post('request-activation-code')
  async requestActivationCode(@Body() {
    username
  }: {
    username: string;
  }): Promise<Result<void>> {
    try {
      await this.coreService.requestActivationCode(username);

      return SUCCESS<void>(void 0);
    } catch (error: unknown) {
      return FAILURE<void>(error as Error);
    }
  }

  @Post('activate-account')
  async activateAccount(@Req() req: Request, @Body() {
    activationCode
  }: {
    activationCode: string;
  }): Promise<Result<Token>> {
    try {
      const session: Session | null = extractSession(req);

      const user: User = await this.coreService.activateAccount(activationCode);

      return await this.tokenService.regenerateToken(session, user);
    } catch (error: unknown) {
      return FAILURE<Token>(error as Error);
    }
  }

  @UseGuards(AuthJwtAuthGuard)
  @Post('logout')
  async logout(@Req() req: Request, @Res() res: Response): Promise<void> {
    try {
      const session: Session | null = extractSession(req);

      await this.tokenService.invalidateToken(session);

      res.status(200).end();
    } catch (error: unknown) {
      res.status(500).end();
    }
  }

  @UseGuards(AuthJwtAuthGuard)
  @Get('verify-session')
  async verifySession(): Promise<Result<boolean>> {
    return SUCCESS<boolean>(true);
  }

  @UseGuards(AuthJwtAuthGuard)
  @Get('get-information')
  async getInformation(@Req() req: Request): Promise<Result<Information>> {
    try {
      const user: User = req.user as User;

      const information: Information = await this.coreService.getInformation(user);

      return SUCCESS<Information>(information);
    } catch (error: unknown) {
      return FAILURE<Information>(error as Error);
    }
  }

  @UseGuards(AuthJwtAuthGuard)
  @Post('update-profile')
  async updateProfile(@Req() req: Request, @Body() {
    displayName,
    userName
  }: {
    displayName: string;
    userName: string;
  }): Promise<Result<Token>> {
    try {
      const session: Session | null = extractSession(req);

      let user: User = req.user as User;

      user = await this.coreService.updateProfile(user, displayName, userName);

      return await this.tokenService.regenerateToken(session, user);
    } catch (error: unknown) {
      return FAILURE<Token>(error as Error);
    }
  }

  @UseGuards(AuthJwtAuthGuard)
  @Post('start-email-address-change')
  async startEmailAddressChange(@Req() req: Request, @Body() {
    emailAddress
  }: {
    emailAddress: string;
  }): Promise<Result<Information>> {
    try {
      const user: User = req.user as User;

      const information: Information = await this.coreService.startEmailAddressChange(user, emailAddress);

      return SUCCESS<Information>(information);
    } catch (error: unknown) {
      return FAILURE<Information>(error as Error);
    }
  }

  @UseGuards(AuthJwtAuthGuard)
  @Post('confirm-email-address-change')
  async confirmEmailAddressChange(@Req() req: Request, @Body() {
    confirmationCode
  }: {
    confirmationCode: string;
  }): Promise<Result<Information>> {
    try {
      const user: User = req.user as User;

      const information: Information = await this.coreService.confirmEmailAddressChange(user, confirmationCode);

      return SUCCESS<Information>(information);
    } catch (error: unknown) {
      return FAILURE<Information>(error as Error);
    }
  }

  @UseGuards(AuthJwtAuthGuard)
  @Post('complete-email-address-change')
  async completeEmailAddressChange(@Req() req: Request, @Body() {
    confirmationCode
  }: {
    confirmationCode: string;
  }): Promise<Result<Token>> {
    try {
      const session: Session | null = extractSession(req);

      let user: User = req.user as User;

      user = await this.coreService.completeEmailAddressChange(user, confirmationCode);

      return await this.tokenService.regenerateToken(session, user);
    } catch (error: unknown) {
      return FAILURE<Token>(error as Error);
    }
  }

  @UseGuards(AuthJwtAuthGuard)
  @Post('cancel-email-address-change')
  async cancelEmailAddressChange(@Req() req: Request, @Body() {
    confirmationCode
  }: {
    confirmationCode: string;
  }): Promise<Result<Information>> {
    try {
      const user: User = req.user as User;

      const information: Information = await this.coreService.cancelEmailAddressChange(user, confirmationCode);

      return SUCCESS<Information>(information);
    } catch (error: unknown) {
      return FAILURE<Information>(error as Error);
    }
  }

  @UseGuards(AuthJwtAuthGuard)
  @Post('resend-email-address-change')
  async resendEmailAddressChange(@Req() req: Request): Promise<Result<Information>> {
    try {
      const user: User = req.user as User;

      const information: Information = await this.coreService.resendEmailAddressChange(user);

      return SUCCESS<Information>(information);
    } catch (error: unknown) {
      return FAILURE<Information>(error as Error);
    }
  }
}
