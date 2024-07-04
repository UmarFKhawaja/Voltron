import { Injectable } from '@nestjs/common';
import { MailService, serializeJSON } from '@voltron/core-library';
import { REDIS_CONSTANTS } from '@voltron/data-library';
import dayjs from 'dayjs';
import { Redis } from 'ioredis';

@Injectable()
export class RedisMailService implements MailService {
  constructor(
    private redis: Redis
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

  private async publishMessage<T>(message: T): Promise<boolean> {
    try {
      const executedAt: Date = dayjs().toDate();

      const result = await this.redis.publish(REDIS_CONSTANTS.Names.Notifications, serializeJSON<T & {
        createdAt: Date;
        updatedAt: Date;
      }>({
        ...message,
        createdAt: executedAt,
        updatedAt: executedAt
      }));

      return true;
    } catch (error: unknown) {
      throw error;
    }
  }
}
