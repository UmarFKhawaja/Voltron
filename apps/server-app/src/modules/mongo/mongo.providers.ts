import {
  AccountDocument,
  AccountModel,
  AccountSchema,
  setSchemaDefaults,
  UserDocument,
  UserModel,
  UserSchema
} from '@voltron/data-library';
import { Connection, createConnection } from 'mongoose';
import { MongoDataService } from './mongo-data.service';
import { MONGO_CONSTANTS } from './mongo.constants';

export const mongoProviders = [
  {
    provide: MONGO_CONSTANTS.Symbols.Connection,
    useFactory: (): Connection => {
      const connectionString = MONGO_CONSTANTS.Settings.connectionString || `mongodb://${MONGO_CONSTANTS.Settings.host}:${MONGO_CONSTANTS.Settings.port}`;
      const options = {
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
    }
  },
  {
    provide: MONGO_CONSTANTS.Symbols.Services.DataService,
    useFactory: (userModel: UserModel, accountModel: AccountModel) => new MongoDataService(userModel, accountModel),
    inject: [MONGO_CONSTANTS.Symbols.Models.UserModel, MONGO_CONSTANTS.Symbols.Models.AccountModel]
  },
  {
    provide: MONGO_CONSTANTS.Symbols.Models.UserModel,
    useFactory: (connection: Connection): UserModel => connection.model<UserDocument, UserModel>('User', UserSchema),
    inject: [MONGO_CONSTANTS.Symbols.Connection]
  },
  {
    provide: MONGO_CONSTANTS.Symbols.Models.AccountModel,
    useFactory: (connection: Connection): AccountModel => connection.model<AccountDocument, AccountModel>('Account', AccountSchema),
    inject: [MONGO_CONSTANTS.Symbols.Connection]
  }
];
