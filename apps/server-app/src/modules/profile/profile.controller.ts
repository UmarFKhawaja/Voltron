import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { User } from '@voltron/common-library';
import { Request } from 'express';
import { AuthJwtAuthGuard } from '../auth/auth-jwt.guard';

@Controller('profile')
export class ProfileController {
  constructor() {
  }

  @UseGuards(AuthJwtAuthGuard)
  @Get()
  getProfile(@Req() req: Request): User {
    return req.user as User;
  }
}
