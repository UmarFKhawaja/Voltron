import { AccountModel, UserModel, VerificationRequestModel } from '@voltron/core-library';
import { Connection } from 'mongoose';

export type ConnectionFactory = () => Promise<Connection>;

export type ModelsFactory = (connection: Connection) => Promise<{
  userModel: UserModel,
  accountModel: AccountModel,
  verificationRequestModel: VerificationRequestModel
}>;
