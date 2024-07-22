import { MJML_CONSTANTS } from './mjml/mjml.constants';
import { NODEMAILER_CONSTANTS } from './nodemailer/nodemailer.constants';
import { SimpleMailService } from './simple-mail.service';
import { SIMPLE_CONSTANTS } from './simple.constants';
import { MailFormatterService, MailSenderService } from './simple.types';

export const simpleProviders = [
  {
    provide: SIMPLE_CONSTANTS.Symbols.Services.MailService,
    useFactory: (mailFormatterService: MailFormatterService, mailSenderService: MailSenderService) => new SimpleMailService(mailFormatterService, mailSenderService),
    inject: [MJML_CONSTANTS.Symbols.Services.MailFormatterService, NODEMAILER_CONSTANTS.Symbols.Services.MailSenderService]
  }
];
