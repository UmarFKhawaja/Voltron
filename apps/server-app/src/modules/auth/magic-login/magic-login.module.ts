import { Module } from '@nestjs/common';
import { RedisModule } from '@voltron/data-library';
import { AuthCoreModule } from '../core/core.module';
import { AuthMagicLoginController } from './magic-login.controller';
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
    AuthMagicLoginStrategy
  ],
  exports: [
    AuthMagicLoginStrategy
  ]
})
export class AuthMagicLoginModule {
}
