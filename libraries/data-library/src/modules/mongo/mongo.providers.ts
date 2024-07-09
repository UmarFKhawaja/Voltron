import {
  Account,
  AccountModel,
  AccountSchema,
  setSchemaDefaults,
  User,
  UserModel,
  UserSchema, VerificationRequest, VerificationRequestModel, VerificationRequestSchema
} from '@voltron/core-library';
import { Connection, ConnectOptions, createConnection } from 'mongoose';
import { MongoAccountService } from './mongo-account.service';
import { MongoUserService } from './mongo-user.service';
import { MongoVerificationRequestService } from './mongo-verification-request.service';
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
      return async (): Promise<{
        userModel: UserModel,
        accountModel: AccountModel,
        verificationRequestModel: VerificationRequestModel
      }> => {
        const connection: Connection = await makeConnection();

        const userModel: UserModel = connection.model<User, UserModel>('User', UserSchema, 'users');
        const accountModel: AccountModel = connection.model<Account, AccountModel>('Account', AccountSchema, 'accounts');
        const verificationRequestModel: VerificationRequestModel = connection.model<VerificationRequest, VerificationRequestModel>('VerificationRequest', VerificationRequestSchema, 'verification_requests');

        return {
          userModel,
          accountModel,
          verificationRequestModel
        };
      };
    },
    inject: [MONGO_CONSTANTS.Symbols.Factories.ConnectionFactory]
  },
  {
    provide: MONGO_CONSTANTS.Symbols.Services.UserService,
    useFactory: async (makeConnection: ConnectionFactory, makeModels: ModelsFactory) => {
      const connection: Connection = await makeConnection();
      const {
        userModel,
        accountModel
      } = await makeModels(connection);

      return new MongoUserService(userModel, accountModel);
    },
    inject: [MONGO_CONSTANTS.Symbols.Factories.ConnectionFactory, MONGO_CONSTANTS.Symbols.Factories.ModelsFactory]
  },
  {
    provide: MONGO_CONSTANTS.Symbols.Services.AccountService,
    useFactory: async (makeConnection: ConnectionFactory, makeModels: ModelsFactory) => {
      const connection: Connection = await makeConnection();
      const {
        accountModel
      } = await makeModels(connection);

      return new MongoAccountService(accountModel);
    },
    inject: [MONGO_CONSTANTS.Symbols.Factories.ConnectionFactory, MONGO_CONSTANTS.Symbols.Factories.ModelsFactory]
  },
  {
    provide: MONGO_CONSTANTS.Symbols.Services.VerificationRequestService,
    useFactory: async (makeConnection: ConnectionFactory, makeModels: ModelsFactory) => {
      const connection: Connection = await makeConnection();
      const {
        verificationRequestModel
      } = await makeModels(connection);

      return new MongoVerificationRequestService(verificationRequestModel);
    },
    inject: [MONGO_CONSTANTS.Symbols.Factories.ConnectionFactory, MONGO_CONSTANTS.Symbols.Factories.ModelsFactory]
  }
];
