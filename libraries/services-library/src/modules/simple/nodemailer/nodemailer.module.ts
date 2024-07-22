import { Module } from '@nestjs/common';
import { nodemailerProviders } from './nodemailer.providers';

@Module({
  providers: [
    ...nodemailerProviders
  ],
  exports: [
    ...nodemailerProviders
  ]
})
export class NodemailerModule {
}
