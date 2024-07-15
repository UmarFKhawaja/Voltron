export interface MailService {
  sendRegisterMail(emailAddress: string, verificationURL: string): Promise<boolean>;

  sendLoginWithMagicLoginMail(emailAddress: string, confirmationURL: string): Promise<boolean>;

  sendResetPasswordMail(emailAddress: string, confirmationURL: string): Promise<boolean>;

  sendConfirmEmailAddressChange(emailAddress: string, confirmationURL: string): Promise<boolean>;

  sendCompleteEmailAddressChange(emailAddress: string, confirmationURL: string): Promise<boolean>;
}
