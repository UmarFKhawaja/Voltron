import { Module } from '@nestjs/common';
import { RedisModule } from '@voltron/data-library';
import { AuthCoreModule } from '../core/core.module';
import { AuthPasswordController } from './password.controller';
import { AuthPasswordStrategy } from './password.strategy';

@Module({
  imports: [
    RedisModule,
    AuthCoreModule
  ],
  controllers: [
    AuthPasswordController
  ],
  providers: [
    AuthPasswordStrategy
  ],
  exports: [
    AuthPasswordStrategy
  ]
})
export class AuthPasswordModule {
}
