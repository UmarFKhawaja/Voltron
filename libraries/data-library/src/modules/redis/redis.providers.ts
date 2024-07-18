import { Redis as Connection } from 'ioredis';
import { RedisMailService } from './redis-mail.service';
import { RedisMessageService } from './redis-message.service';
import { RedisSessionService } from './redis-session.service';
import { REDIS_CONSTANTS } from './redis.constants';
import { ConnectionFactory } from './redis.types';

export const redisProviders = [
  {
    provide: REDIS_CONSTANTS.Symbols.Factories.ConnectionFactory,
    useFactory: (): ConnectionFactory => {
      return async (): Promise<Connection> => {
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

        const connection: Connection = new Connection(options);

        return connection;
      };
    }
  },
  {
    provide: REDIS_CONSTANTS.Symbols.Services.MailService,
    useFactory: async (makeConnection: ConnectionFactory) => {
      const connection: Connection = await makeConnection();

      return new RedisMailService(connection);
    },
    inject: [REDIS_CONSTANTS.Symbols.Factories.ConnectionFactory]
  },
  {
    provide: REDIS_CONSTANTS.Symbols.Services.MessageService,
    useFactory: async (makeConnection: ConnectionFactory) => {
      const connection: Connection = await makeConnection();

      return new RedisMessageService(connection);
    },
    inject: [REDIS_CONSTANTS.Symbols.Factories.ConnectionFactory]
  },
  {
    provide: REDIS_CONSTANTS.Symbols.Services.SessionService,
    useFactory: async (makeConnection: ConnectionFactory) => {
      const connection: Connection = await makeConnection();

      return new RedisSessionService(connection);
    },
    inject: [REDIS_CONSTANTS.Symbols.Factories.ConnectionFactory]
  }
];
