import { Module } from '@nestjs/common';
import { RedisModule } from '@voltron/data-library';
import { AuthCoreModule } from '../core/core.module';
import { AuthMagicLoginController } from './magic-login.controller';
import { AuthMagicLoginStrategyService } from './magic-login-strategy.service';
import { AuthMagicLoginStrategy } from './magic-login.strategy';

@Module({
  imports: [
    RedisModule,
    AuthCoreModule
  ],
  controllers: [
    AuthMagicLoginController
  ],
  providers: [
    AuthMagicLoginStrategyService,
    AuthMagicLoginStrategy
  ],
  exports: [
    AuthMagicLoginStrategy
  ]
})
export class AuthMagicLoginModule {
}
