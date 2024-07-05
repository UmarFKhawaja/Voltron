import {
  Account,
  AccountModel,
  AccountSchema,
  setSchemaDefaults,
  User,
  UserModel,
  UserSchema
} from '@voltron/core-library';
import { Connection, ConnectOptions, createConnection } from 'mongoose';
import { MongoDataService } from './mongo-data.service';
import { MONGO_CONSTANTS } from './mongo.constants';
import { ConnectionFactory, ModelsFactory } from './mongo.types';

export const mongoProviders = [
  {
    provide: MONGO_CONSTANTS.Symbols.Factories.ConnectionFactory,
    useFactory: (): ConnectionFactory => {
      return async (): Promise<Connection> => {
        const connectionString: string =
          MONGO_CONSTANTS.Settings.connectionString ||
          `mongodb://${MONGO_CONSTANTS.Settings.host}:${MONGO_CONSTANTS.Settings.port}`;
        const options: ConnectOptions = {
          dbName: MONGO_CONSTANTS.Settings.database,
          ...(MONGO_CONSTANTS.Settings.username && MONGO_CONSTANTS.Settings.password ? {
            auth: {
              username: MONGO_CONSTANTS.Settings.username,
              password: MONGO_CONSTANTS.Settings.password
            }
          } : {})
        };

        const connection: Connection = createConnection(connectionString, options);

        connection.plugin(setSchemaDefaults);

        return connection;
      };
    }
  },
  {
    provide: MONGO_CONSTANTS.Symbols.Factories.ModelsFactory,
    useFactory: (makeConnection: ConnectionFactory): ModelsFactory => {
      return async (): Promise<[UserModel, AccountModel]> => {
        const connection: Connection = await makeConnection();

        const userModel: UserModel = connection.model<User, UserModel>('User', UserSchema);
        const accountModel: AccountModel = connection.model<Account, AccountModel>('Account', AccountSchema);

        return [userModel, accountModel];
      };
    },
    inject: [MONGO_CONSTANTS.Symbols.Factories.ConnectionFactory]
  },
  {
    provide: MONGO_CONSTANTS.Symbols.Services.DataService,
    useFactory: async (makeConnection: ConnectionFactory, makeModels: ModelsFactory) => {
      const connection: Connection = await makeConnection();
      const [userModel, accountModel] = await makeModels(connection);

      return new MongoDataService(userModel, accountModel);
    },
    inject: [MONGO_CONSTANTS.Symbols.Factories.ConnectionFactory, MONGO_CONSTANTS.Symbols.Factories.ModelsFactory]
  }
];
