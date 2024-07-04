export interface MailService {
  sendRegisterMail(emailAddress: string, verificationURL: string): Promise<boolean>;

  sendLoginWithMagicLoginMail(emailAddress: string, confirmationURL: string): Promise<boolean>;
}
