import { Injectable } from '@nestjs/common';
import { MailService, serializeJSON } from '@voltron/core-library';
import dayjs from 'dayjs';
import { Redis as Connection } from 'ioredis';
import { REDIS_CONSTANTS } from './redis.constants';

@Injectable()
export class RedisMailService implements MailService {
  constructor(
    private connection: Connection
  ) {
  }

  async sendRegisterMail(emailAddress: string, verificationURL: string): Promise<boolean> {
    return await this.publishMessage({
      type: 'SEND_REGISTER_MAIL',
      emailAddress,
      verificationURL
    });
  }

  async sendLoginWithMagicLoginMail(emailAddress: string, confirmationURL: string): Promise<boolean> {
    return await this.publishMessage({
      type: 'SEND_LOGIN_WITH_MAGIC_LOGIN_MAIL',
      emailAddress,
      confirmationURL
    });
  }

  async sendResetPasswordMail(emailAddress: string, confirmationURL: string): Promise<boolean> {
    return await this.publishMessage({
      type: 'SEND_RESET_PASSWORD_MAIL',
      emailAddress,
      confirmationURL
    });
  }

  async sendConfirmEmailAddressChange(emailAddress: string, confirmationURL: string): Promise<boolean> {
    return await this.publishMessage({
      type: 'SEND_CONFIRM_EMAIL_ADDRESS_CHANGE_MAIL',
      emailAddress,
      confirmationURL
    });
  }

  async sendCompleteEmailAddressChange(emailAddress: string, confirmationURL: string): Promise<boolean> {
    return await this.publishMessage({
      type: 'SEND_COMPLETE_EMAIL_ADDRESS_CHANGE_MAIL',
      emailAddress,
      confirmationURL
    });
  }

  private async publishMessage<T>(message: T): Promise<boolean> {
    const executedAt: Date = dayjs().toDate();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const result = await this.connection.publish(REDIS_CONSTANTS.Names.Notifications, serializeJSON<T & {
      createdAt: Date;
      updatedAt: Date;
    }>({
      ...message,
      createdAt: executedAt,
      updatedAt: executedAt
    }));

    return true;
  }
}
