import { Injectable } from '@nestjs/common';
import { Transporter as Connection } from 'nodemailer';
import { MailSenderService } from '../../contracts';
import { Mail } from '../../types';

@Injectable()
export class NodemailerMailSenderService implements MailSenderService {
  constructor(
    private readonly connection: Connection
  ) {
  }

  async sendMail(mail: Mail): Promise<boolean> {
    await this.connection.sendMail({
      from: mail.from,
      to: mail.to,
      subject: mail.subject,
      html: mail.content
    });

    return true;
  }
}
