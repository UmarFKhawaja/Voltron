import { Injectable } from '@nestjs/common';
import { deserializeJSON, MessageService, Task } from '@voltron/core-library';
import { REDIS_CONSTANTS } from '@voltron/data-library';
import dayjs from 'dayjs';
import { Redis } from 'ioredis';

@Injectable()
export class RedisMessageService implements MessageService {
  constructor(
    private readonly redis: Redis
  ) {
  }

  async watchForMessages(handleTask: (task: Task) => Promise<void>): Promise<void> {
    this.redis.subscribe(REDIS_CONSTANTS.Names.Notifications);
    this.redis.on('message', async (channel: string, message: string): Promise<void> => {
      const task: Task = {
        ...deserializeJSON<Task>(message),
        updatedAt: dayjs().toDate()
      };

      await handleTask(task);
    });
  }
}
