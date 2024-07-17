import { Module } from '@nestjs/common';
import { AuthCoreModule } from '../core/core.module';
import { AuthGoogleProfileService } from './google-profile.service';
import { AuthGoogleController } from './google.controller';
import { AuthGoogleStrategy } from './google.strategy';

@Module({
  imports: [
    AuthCoreModule
  ],
  controllers: [
    AuthGoogleController
  ],
  providers: [
    AuthGoogleStrategy,
    AuthGoogleProfileService
  ],
  exports: [
    AuthGoogleStrategy,
    AuthGoogleProfileService
  ]
})
export class AuthGoogleModule {
}
