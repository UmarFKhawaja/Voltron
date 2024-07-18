import { Injectable } from '@nestjs/common';
import { SessionService } from '@voltron/core-library';
import dayjs from 'dayjs';
import { Redis as Connection } from 'ioredis';

@Injectable()
export class RedisSessionService implements SessionService {
  constructor(
    private readonly connection: Connection
  ) {
  }

  async hasSessionExpiry(id: string): Promise<boolean> {
    const result: number = await this.connection.exists(`session:${id}`);

    return result > 0;
  }

  async getSessionExpiry(id: string): Promise<Date> {
    const timestamp: number = parseInt(await this.connection.get(`session:${id}`) || '0');

    if (timestamp) {
      return new Date(timestamp);
    }

    throw new Error('session id does not exist');
  }

  async setSessionExpiry(id: string, expiresAt: Date): Promise<void> {
    const timestamp: number = expiresAt.valueOf();
    const ttl: number = dayjs(expiresAt).diff(dayjs(), 'seconds');

    await this.connection.set(`session:${id}`, timestamp);
    await this.connection.expire(`session:${id}`, ttl);
  }

  async unsetSessionExpiry(id: string): Promise<void> {
    await this.connection.del(`session:${id}`);
  }
}
