import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MongoModule, RedisModule } from '@voltron/data-library';
import { AuthAcceptController } from './auth-accept.controller';
import { AuthConnectController } from './auth-connect.controller';
import { AuthDisconnectController } from './auth-disconnect.controller';
import { AuthFacebookStrategy } from './auth-facebook.strategy';
import { AuthGoogleStrategy } from './auth-google.strategy';
import { AuthJwtStrategy } from './auth-jwt.strategy';
import { AuthLocalStrategy } from './auth-local.strategy';
import { AuthLoginController } from './auth-login.controller';
import { AuthLogoutController } from './auth-logout.controller';
import { AuthMagicLoginStrategy } from './auth-magic-login.strategy';
import { AuthRegisterController } from './auth-register.controller';
import { AuthStrategyService } from './auth-strategy.service';
import { AuthTokenService } from './auth-token.service';
import { AuthUserService } from './auth-user.service';
import { AuthVerificationRequestService } from './auth-verification-request.service';
import { AUTH_CONSTANTS } from './auth.constants';
import { AuthController } from './auth.controller';
import { AuthURLService } from './auth-url.service';
import { AuthFacebookProfileService } from './auth-facebook-profile.service';
import { AuthGoogleProfileService } from './auth-google-profile.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: AUTH_CONSTANTS.Strategies.JWT.secret,
      signOptions: {
        expiresIn: AUTH_CONSTANTS.Strategies.JWT.expiresIn
      }
    }),
    MongoModule,
    RedisModule
  ],
  controllers: [
    AuthController,
    AuthRegisterController,
    AuthLoginController,
    AuthLogoutController,
    AuthAcceptController,
    AuthConnectController,
    AuthDisconnectController
  ],
  providers: [
    AuthStrategyService,
    AuthTokenService,
    AuthUserService,
    AuthVerificationRequestService,
    AuthJwtStrategy,
    AuthLocalStrategy,
    AuthMagicLoginStrategy,
    AuthFacebookStrategy,
    AuthGoogleStrategy,
    AuthURLService,
    AuthFacebookProfileService,
    AuthGoogleProfileService
  ]
})
export class AuthModule {}
