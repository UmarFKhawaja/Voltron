import { Document, Model, Query, Schema, Types } from 'mongoose';
import { ProviderType } from './ProviderType';

export const AccountSchema = new Schema<Account, AccountModel>({
  providerType: {
    type: String,
    required: true,
    values: Object.values(ProviderType)
  },
  providerID: {
    type: String,
    required: true,
    unique: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
});

AccountSchema.virtual('id').get(function () {
  return this._id;
});

export interface IAccount {
  providerType: string;
  providerID: string;
  createdAt: Date;
  updatedAt: Date;
  user: Types.ObjectId | Record<string, unknown>;
}

export interface Account extends IAccount, Document {
  _id: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AccountModel extends Model<Account> {
}

AccountSchema.pre<Account>('save', function (next) {
  next();
});

// eslint-disable-next-line @typescript-eslint/no-empty-function
AccountSchema.post<Query<Account, Account>>('findOneAndUpdate', async function (document) {
});
