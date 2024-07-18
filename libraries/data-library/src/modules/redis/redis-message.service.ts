import { Injectable } from '@nestjs/common';
import { deserializeJSON, MessageService, Task } from '@voltron/core-library';
import dayjs from 'dayjs';
import { Redis as Connection } from 'ioredis';
import { REDIS_CONSTANTS } from './redis.constants';

@Injectable()
export class RedisMessageService implements MessageService {
  constructor(
    private readonly connection: Connection
  ) {
  }

  async watchForMessages(handleTask: (task: Task) => Promise<void>): Promise<void> {
    this.connection.subscribe(REDIS_CONSTANTS.Names.Notifications);
    this.connection.on('message', async (channel: string, message: string): Promise<void> => {
      const task: Task = {
        ...deserializeJSON<Task>(message),
        updatedAt: dayjs().toDate()
      };

      await handleTask(task);
    });
  }
}
