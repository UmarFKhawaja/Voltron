import { Redis } from 'ioredis';
import { REDIS_CONSTANTS } from './redis.constants';

export const redisProvider = {
  provide: 'REDIS',
  useFactory: (): Redis => {
    const options = {
      host: REDIS_CONSTANTS.host,
      port: REDIS_CONSTANTS.port,
      ...(REDIS_CONSTANTS.username ? {
        username: REDIS_CONSTANTS.username
      } : {}),
      ...(REDIS_CONSTANTS.password ? {
        password: REDIS_CONSTANTS.password
      } : {})
    };

    return new Redis(options);
  }
};
