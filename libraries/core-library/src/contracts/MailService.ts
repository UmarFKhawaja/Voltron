export interface MailService {
  sendRegisterMail(emailAddress: string, verificationURL: string): Promise<boolean>;

  sendLoginWithMagicLoginMail(emailAddress: string, confirmationURL: string): Promise<boolean>;

  sendResetPasswordMail(emailAddress: string, confirmationURL: string): Promise<boolean>;

  sendConfirmEmailAddressChange(oldEmailAddress: string, newEmailAddress: string, confirmationURL: string): Promise<boolean>;

  sendCompleteEmailAddressChange(oldEmailAddress: string, newEmailAddress: string, confirmationURL: string): Promise<boolean>;
}
