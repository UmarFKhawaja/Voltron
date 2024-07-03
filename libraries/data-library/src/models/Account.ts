import { Document, Model, model, Types, Schema, Query } from 'mongoose';
import { ProviderType } from '../types';

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

AccountSchema.virtual('id').get(function() {
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
  // user: User['_id'];
}

export interface AccountPopulatedDocument extends AccountBaseDocument {
  // user: User;
}

export interface AccountModel extends Model<AccountDocument> {
}

AccountSchema.pre<AccountDocument>('save', function (next) {
  next();
});

AccountSchema.post<Query<AccountDocument, AccountDocument>>('findOneAndUpdate', async function (document) {
});
