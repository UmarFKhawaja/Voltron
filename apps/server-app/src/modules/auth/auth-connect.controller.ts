import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthFacebookAuthGuard } from './auth-facebook.guard';
import { AuthGoogleAuthGuard } from './auth-google.guard';

@Controller('auth/connect')
export class AuthConnectController {
  @UseGuards(AuthFacebookAuthGuard)
  @Get('facebook')
  async connectFacebook(): Promise<void> {
    // NOTE : do nothing
  }

  @UseGuards(AuthGoogleAuthGuard)
  @Get('google')
  async connectGoogle(): Promise<void> {
    // NOTE : do nothing
  }
}
