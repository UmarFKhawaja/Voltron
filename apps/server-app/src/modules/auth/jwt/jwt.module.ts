import { Module } from '@nestjs/common';
import { AuthCoreModule } from '../core/core.module';
import { AuthJwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    AuthCoreModule
  ],
  providers: [
    AuthJwtStrategy
  ],
  exports: [
    AuthJwtStrategy
  ]
})
export class AuthJwtModule {
}
