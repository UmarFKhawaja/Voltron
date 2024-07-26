import { Module } from '@nestjs/common';
import { MJMLModule, NodemailerModule } from '@voltron/services-library';
import { simpleProviders } from './simple.providers';

@Module({
  imports: [
    MJMLModule,
    NodemailerModule
  ],
  providers: [
    ...simpleProviders
  ],
  exports: [
    ...simpleProviders
  ]
})
export class SimpleModule {
}
