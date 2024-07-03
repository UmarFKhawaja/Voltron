import { Redis } from 'ioredis';
import { RedisSessionService } from './redis-session.service';
import { REDIS_CONSTANTS } from './redis.constants';

export const redisProviders = [
  {
    provide: REDIS_CONSTANTS.Symbols.Connection,
    useFactory: async (): Promise<Redis> => {
      const options = {
        host: REDIS_CONSTANTS.Settings.host,
        port: REDIS_CONSTANTS.Settings.port,
        ...(REDIS_CONSTANTS.Settings.username ? {
          username: REDIS_CONSTANTS.Settings.username
        } : {}),
        ...(REDIS_CONSTANTS.Settings.password ? {
          password: REDIS_CONSTANTS.Settings.password
        } : {})
      };

      const redis: Redis = new Redis(options);

      return redis;
    }
  },
  {
    provide: REDIS_CONSTANTS.Symbols.Services.SessionService,
    useFactory: (redis: Redis) => new RedisSessionService(redis),
    inject: [REDIS_CONSTANTS.Symbols.Connection]
  }
];
