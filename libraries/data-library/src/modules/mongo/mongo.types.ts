import { AccountModel, UserModel } from '@voltron/core-library';
import { Connection } from 'mongoose';

export type ConnectionFactory = () => Promise<Connection>;

export type ModelsFactory = (connection: Connection) => Promise<[UserModel, AccountModel]>;
