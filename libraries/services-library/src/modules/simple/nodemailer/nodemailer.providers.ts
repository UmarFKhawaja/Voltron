import { createTransport, Transporter as Connection } from 'nodemailer';
import { NodemailerMailSenderService } from './nodemailer-mail-sender.service';
import { NODEMAILER_CONSTANTS } from './nodemailer.constants';
import { ConnectionFactory } from './nodemailer.types';

export const nodemailerProviders = [
  {
    provide: NODEMAILER_CONSTANTS.Symbols.Factories.NodemailerConnectionFactory,
    useFactory: (): ConnectionFactory => {
      return async (): Promise<Connection> => createTransport({
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
    provide: NODEMAILER_CONSTANTS.Symbols.Services.MailSenderService,
    useFactory: async (makeConnection: ConnectionFactory): Promise<NodemailerMailSenderService> => {
      const connection: Connection = await makeConnection();

      return new NodemailerMailSenderService(connection);
    },
    inject: [NODEMAILER_CONSTANTS.Symbols.Factories.NodemailerConnectionFactory]
  }
];
