import { Injectable, Logger } from '@nestjs/common';
 import { MailService } from '@voltron/core-library';
import { Transporter as Connection } from 'nodemailer';

@Injectable()
export class NodemailerMailService implements MailService {
  constructor(
    private readonly connection: Connection
  ) {
  }

  async sendRegisterMail(emailAddress: string, verificationURL: string): Promise<boolean> {
    Logger.log(emailAddress);
    Logger.log(verificationURL);

    return true;
  }

  async sendLoginWithMagicLoginMail(emailAddress: string, confirmationURL: string): Promise<boolean> {
    Logger.log(emailAddress);
    Logger.log(confirmationURL);

    return true;
  }

  async sendResetPasswordMail(emailAddress: string, confirmationURL: string): Promise<boolean> {
    Logger.log(emailAddress);
    Logger.log(confirmationURL);

    return true;
  }

  async sendConfirmEmailAddressChange(emailAddress: string, confirmationURL: string): Promise<boolean> {
    Logger.log(emailAddress);
    Logger.log(confirmationURL);

    return true;
  }

  async sendCompleteEmailAddressChange(emailAddress: string, confirmationURL: string): Promise<boolean> {
    Logger.log(emailAddress);
    Logger.log(confirmationURL);

    return true;
  }
}
