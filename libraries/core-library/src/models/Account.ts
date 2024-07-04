import { Document, Model, Query, Schema, Types } from 'mongoose';
import { ProviderType } from './ProviderType';

export const AccountSchema = new Schema<AccountDocument, AccountModel>({
  providerType: {
    type: String,
    required: true,
    values: Object.values(ProviderType)
  },
  providerInfo: {
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

export interface Account {
  id: string;
  providerType: string;
  providerInfo: string;
  createdAt: Date;
  updatedAt: Date;
  user: Types.ObjectId | Record<string, unknown>;
}

interface AccountBaseDocument extends Omit<Account, 'id'>, Document {
}

export interface AccountDocument extends AccountBaseDocument {
}

export interface AccountPopulatedDocument extends AccountBaseDocument {
}

export interface AccountModel extends Model<AccountDocument> {
}

AccountSchema.pre<AccountDocument>('save', function (next) {
  next();
});

AccountSchema.post<Query<AccountDocument, AccountDocument>>('findOneAndUpdate', async function (document) {
});
