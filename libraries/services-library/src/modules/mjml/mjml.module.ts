import { Module } from '@nestjs/common';
import { mjmlProviders } from './mjml.providers';

@Module({
  providers: [
    ...mjmlProviders
  ],
  exports: [
    ...mjmlProviders
  ]
})
export class MJMLModule {
}
