import * as mongoose from 'mongoose';
import { MONGO_CONSTANTS } from './mongo.constants';

export const mongoProvider = {
  provide: 'MONGO',
  useFactory: (): Promise<typeof mongoose> => {
    const connectionString = MONGO_CONSTANTS.connectionString || `mongodb://${MONGO_CONSTANTS.host}:${MONGO_CONSTANTS.port}`;
    const options = {
      ...(MONGO_CONSTANTS.username && MONGO_CONSTANTS.password ? {
        auth: {
          username: MONGO_CONSTANTS.username,
          password: MONGO_CONSTANTS.password
        }
      } : {})
    };

    return mongoose.connect(connectionString, options);
  }
};
