import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongoModule, RedisModule } from '@voltron/data-library';
import { AUTH_CONSTANTS } from '../auth.constants';
import { AuthTokenService } from './token.service';
import { AuthURLService } from './url.service';
import { AuthUserService } from './user.service';
import { AuthVerificationRequestService } from './verification-request.service';

@Module({
  imports: [
    JwtModule.register({
      secret: AUTH_CONSTANTS.Strategies.JWT.secret,
      signOptions: {
        expiresIn: AUTH_CONSTANTS.Strategies.JWT.expiresIn
      }
    }),
    MongoModule,
    RedisModule
  ],
  providers: [
    AuthTokenService,
    AuthURLService,
    AuthUserService,
    AuthVerificationRequestService
  ],
  exports: [
    AuthTokenService,
    AuthURLService,
    AuthUserService,
    AuthVerificationRequestService
  ]
})
export class AuthCoreModule {
}
