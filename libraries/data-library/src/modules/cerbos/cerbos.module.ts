import { Module } from '@nestjs/common';
import { cerbosProviders } from './cerbos.providers';

@Module({
  providers: [
    ...cerbosProviders
  ],
  exports: [
    ...cerbosProviders
  ]
})
export class CerbosModule {
}
