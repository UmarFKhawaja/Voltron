import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthAcceptController } from './auth-accept.controller';
import { AuthConnectController } from './auth-connect.controller';
import { AuthDisconnectController } from './auth-disconnect.controller';
import { AuthJwtStrategy } from './auth-jwt.strategy';
import { AuthLocalStrategy } from './auth-local.strategy';
import { AuthLoginController } from './auth-login.controller';
import { AuthLogoutController } from './auth-logout.controller';
import { AuthMagicLoginStrategy } from './auth-magic-login.strategy';
import { AuthRegisterController } from './auth-register.controller';
import { AuthStrategyService } from './auth-strategy.service';
import { AuthTokenService } from './auth-token.service';
import { AuthUserService } from './auth-user.service';
import { JWT_CONSTANTS } from './auth.constants';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: JWT_CONSTANTS.secret,
      signOptions: {
        expiresIn: JWT_CONSTANTS.expiresIn
      }
    })
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
    AuthJwtStrategy,
    AuthLocalStrategy,
    AuthMagicLoginStrategy
  ]
})
export class AuthModule {
}
