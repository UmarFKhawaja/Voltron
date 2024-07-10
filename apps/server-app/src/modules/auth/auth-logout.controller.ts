import { Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthJwtAuthGuard } from './auth-jwt.guard';
import { AuthTokenService } from './auth-token.service';
import { extractSession } from './auth.methods';

@Controller('auth/logout')
export class AuthLogoutController {
  constructor(
    private readonly tokenService: AuthTokenService
  ) {
  }

  @UseGuards(AuthJwtAuthGuard)
  @Post('')
  async logout(@Req() req: Request, @Res() res: Response): Promise<void> {
    await this.tokenService.invalidateToken(extractSession(req));

    res.status(200).end();
  }
}
