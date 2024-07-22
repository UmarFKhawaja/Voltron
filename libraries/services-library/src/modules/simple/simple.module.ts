import { Module } from '@nestjs/common';
import { MJMLModule } from './mjml/mjml.module';
import { NodemailerModule } from './nodemailer/nodemailer.module';
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
