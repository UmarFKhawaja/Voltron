import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Result, Token, User } from '@voltron/common-library';
import { Request } from 'express';
import { AuthMagicLoginAuthGuard } from './auth-magic-login.guard';
import { AuthTokenService } from './auth-token.service';

@Controller('auth/accept')
export class AuthAcceptController {
  constructor(
    private readonly tokenService: AuthTokenService
  ) {
  }

  @UseGuards(AuthMagicLoginAuthGuard)
  @Get('magic-login')
  async magicLogin(@Req() req: Request): Promise<Result<Token>> {
    return this.tokenService.generateToken(req.user as User);
  }
}
