import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthUserService } from './auth-user.service';

@Controller('auth/register')
export class AuthRegisterController {
  constructor(
    private readonly userService: AuthUserService
  ) {
  }

  @Post('')
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
    await this.userService.registerUser(displayName, userName, emailAddress, password);

    res.json({
      success: true
    });
  }
}
