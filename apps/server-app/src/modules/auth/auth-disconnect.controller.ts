import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Result, Token } from '@voltron/common-library';
import { ProviderType, User } from '@voltron/core-library';
import { Request } from 'express';
import { AuthJwtAuthGuard } from './auth-jwt.guard';
import { AuthTokenService } from './auth-token.service';
import { AuthUserService } from './auth-user.service';
import { extractSession } from './auth.methods';

@Controller('auth/disconnect')
export class AuthDisconnectController {
  constructor(
    private readonly tokenService: AuthTokenService,
    private readonly userService: AuthUserService
  ) {
  }

  @UseGuards(AuthJwtAuthGuard)
  @Get('facebook')
  async disconnectFacebook(@Req() req: Request): Promise<Result<Token>> {
    const user: User = await this.userService.ensureUserNotWithProvider(req.user as User, ProviderType.FACEBOOK);

    await this.tokenService.invalidateToken(extractSession(req));

    return await this.tokenService.generateToken(user);
  }

  @UseGuards(AuthJwtAuthGuard)
  @Get('google')
  async disconnectGoogle(@Req() req: Request): Promise<Result<Token>> {
    const user: User = await this.userService.ensureUserNotWithProvider(req.user as User, ProviderType.GOOGLE);

    await this.tokenService.invalidateToken(extractSession(req));

    return await this.tokenService.generateToken(user);
  }
}
