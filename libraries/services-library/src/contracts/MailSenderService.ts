import { Mail } from '../types';

export interface MailSenderService {
  sendMail(mail: Mail): Promise<boolean>;
}
