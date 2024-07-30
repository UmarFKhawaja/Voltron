export interface MailService {
  sendRegisterMail(emailAddress: string, verificationURL: string): Promise<boolean>;

  sendLoginWithMagicLoginMail(emailAddress: string, confirmationURL: string): Promise<boolean>;

  sendResetPasswordMail(emailAddress: string, confirmationURL: string): Promise<boolean>;

  sendConfirmEmailAddressChangeMail(oldEmailAddress: string, newEmailAddress: string, confirmationURL: string): Promise<boolean>;

  sendCompleteEmailAddressChangeMail(oldEmailAddress: string, newEmailAddress: string, confirmationURL: string): Promise<boolean>;
}
