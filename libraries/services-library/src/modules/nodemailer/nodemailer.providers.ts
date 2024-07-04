import { createTransport } from 'nodemailer';
import { NodemailerMailService } from './nodemailer-mail.service';
import { NODEMAILER_CONSTANTS } from './nodemailer.constants';
import { TransporterFactory } from './nodemailer.types';

export const nodemailerProviders = [
  {
    provide: NODEMAILER_CONSTANTS.Symbols.Factories.NodemailerTransportFactory,
    useFactory: (): TransporterFactory => {
      return () => createTransport({
        host: NODEMAILER_CONSTANTS.Settings.host,
        port: NODEMAILER_CONSTANTS.Settings.port,
        secure: NODEMAILER_CONSTANTS.Settings.useTLS,
        auth: {
          user: NODEMAILER_CONSTANTS.Settings.auth.username,
          pass: NODEMAILER_CONSTANTS.Settings.auth.password
        }
      })
    }
  },
  {
    provide: NODEMAILER_CONSTANTS.Symbols.Services.MailService,
    useFactory: (transporterFactory: TransporterFactory) => new NodemailerMailService(transporterFactory),
    inject: [NODEMAILER_CONSTANTS.Symbols.Factories.NodemailerTransportFactory]
  }
];
