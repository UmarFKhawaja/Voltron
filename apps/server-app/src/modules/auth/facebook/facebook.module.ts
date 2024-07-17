import { Module } from '@nestjs/common';
import { AuthCoreModule } from '../core/core.module';
import { AuthFacebookProfileService } from './facebook-profile.service';
import { AuthFacebookController } from './facebook.controller';
import { AuthFacebookStrategy } from './facebook.strategy';

@Module({
  imports: [
    AuthCoreModule
  ],
  controllers: [
    AuthFacebookController
  ],
  providers: [
    AuthFacebookStrategy,
    AuthFacebookProfileService
  ],
  exports: [
    AuthFacebookStrategy,
    AuthFacebookProfileService
  ]
})
export class AuthFacebookModule {
}
