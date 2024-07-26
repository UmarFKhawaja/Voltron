import { Mail } from '../types';

export interface MailFormatterService {
  formatRegisterMail(emailAddress: string, verificationURL: string): Promise<Mail>;

  formatLoginWithMagicLoginMail(emailAddress: string, confirmationURL: string): Promise<Mail>;

  formatResetPasswordMail(emailAddress: string, confirmationURL: string): Promise<Mail>;

  formatConfirmEmailAddressChange(oldEmailAddress: string, newEmailAddress: string, confirmationURL: string): Promise<Mail>;

  formatCompleteEmailAddressChange(oldEmailAddress: string, newEmailAddress: string, confirmationURL: string): Promise<Mail>;
}
