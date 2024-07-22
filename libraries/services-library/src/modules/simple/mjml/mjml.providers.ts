import { MJMLMailFormatterService } from './mjml-mail-formatter.service';
import { MJML_CONSTANTS } from './mjml.constants';

export const mjmlProviders = [
  {
    provide: MJML_CONSTANTS.Symbols.Services.MailFormatterService,
    useFactory: () => new MJMLMailFormatterService()
  }
];
