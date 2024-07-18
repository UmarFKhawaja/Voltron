import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { CerbosModule, MongoModule, RedisModule } from '@voltron/data-library';
import { AuthController } from './auth.controller';
import { AuthCoreModule } from './core/core.module';
import { AuthFacebookModule } from './facebook/facebook.module';
import { AuthGoogleModule } from './google/google.module';
import { AuthJwtModule } from './jwt/jwt.module';
import { AuthMagicLoginModule } from './magic-login/magic-login.module';
import { AuthPasswordModule } from './password/password.module';

@Module({
  imports: [
    PassportModule,
    CerbosModule,
    MongoModule,
    RedisModule,
    AuthCoreModule,
    AuthFacebookModule,
    AuthGoogleModule,
    AuthPasswordModule,
    AuthMagicLoginModule,
    AuthJwtModule
  ],
  controllers: [
    AuthController
  ]
})
export class AuthModule {
}
