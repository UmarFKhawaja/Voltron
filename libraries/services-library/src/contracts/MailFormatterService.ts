import { Mail } from '../types';

export interface MailFormatterService {
  formatRegisterMail(emailAddress: string, verificationURL: string): Promise<Mail>;

  formatLoginWithMagicLoginMail(emailAddress: string, confirmationURL: string): Promise<Mail>;

  formatResetPasswordMail(emailAddress: string, confirmationURL: string): Promise<Mail>;

  formatConfirmEmailAddressChangeMail(oldEmailAddress: string, newEmailAddress: string, confirmationURL: string): Promise<Mail>;

  formatCompleteEmailAddressChangeMail(oldEmailAddress: string, newEmailAddress: string, confirmationURL: string): Promise<Mail>;
}
