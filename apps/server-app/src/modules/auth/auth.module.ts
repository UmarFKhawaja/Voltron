import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MongoModule } from '../mongo/mongo.module';
import { RedisModule } from '../redis/redis.module';
import { AuthJwtStrategy } from './auth-jwt.strategy';
import { AuthLocalStrategy } from './auth-local.strategy';
import { AuthMagicLoginStrategy } from './auth-magic-login.strategy';
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
    }),
    MongoModule,
    RedisModule
  ],
  controllers: [
    AuthController
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
