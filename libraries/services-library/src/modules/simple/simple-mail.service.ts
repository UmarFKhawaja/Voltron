import { Injectable } from '@nestjs/common';
import { MailService } from '@voltron/core-library';
import { Mail, MailFormatterService, MailSenderService } from './simple.types';

@Injectable()
export class SimpleMailService implements MailService {
  constructor(
    private readonly mailFormatterService: MailFormatterService,
    private readonly mailSenderService: MailSenderService
  ) {
  }

  async sendRegisterMail(emailAddress: string, verificationURL: string): Promise<boolean> {
    const mail: Mail = await this.mailFormatterService.formatRegisterMail(emailAddress, verificationURL);

    return await this.mailSenderService.sendMail(mail);
  }

  async sendLoginWithMagicLoginMail(emailAddress: string, confirmationURL: string): Promise<boolean> {
    const mail: Mail = await this.mailFormatterService.formatLoginWithMagicLoginMail(emailAddress, confirmationURL);

    return await this.mailSenderService.sendMail(mail);
  }

  async sendResetPasswordMail(emailAddress: string, confirmationURL: string): Promise<boolean> {
    const mail: Mail = await this.mailFormatterService.formatResetPasswordMail(emailAddress, confirmationURL);

    return await this.mailSenderService.sendMail(mail);
  }

  async sendConfirmEmailAddressChange(oldEmailAddress: string, newEmailAddress: string, confirmationURL: string): Promise<boolean> {
    const mail: Mail = await this.mailFormatterService.formatConfirmEmailAddressChange(oldEmailAddress, newEmailAddress, confirmationURL);

    return await this.mailSenderService.sendMail(mail);
  }

  async sendCompleteEmailAddressChange(oldEmailAddress: string, newEmailAddress: string, confirmationURL: string): Promise<boolean> {
    const mail: Mail = await this.mailFormatterService.formatCompleteEmailAddressChange(oldEmailAddress, newEmailAddress, confirmationURL);

    return await this.mailSenderService.sendMail(mail);
  }
}
