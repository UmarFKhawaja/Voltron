import { Document, Model, Types, Schema, Query } from 'mongoose';

export const UserSchema = new Schema<UserDocument, UserModel>({
  displayName: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    required: true,
    unique: true
  },
  emailAddress: {
    type: String,
    required: true,
    unique: true
  },
  accounts: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Account'
    }
  ]
});

UserSchema.virtual('id').get(function() {
  return this._id;
});

export interface User {
  id: string;
  displayName: string;
  userName: string;
  emailAddress: string;
  createdAt: Date;
  updatedAt: Date;
  accounts: Array<Types.ObjectId | Record<string, unknown>>;
}

interface UserBaseDocument extends Omit<User, 'id'>, Document {
}

export interface UserDocument extends UserBaseDocument {
  // accounts: Account['_id'];
}

export interface UserPopulatedDocument extends UserBaseDocument {
  // accounts: Account[];
}

export interface UserModel extends Model<UserDocument> {
}

UserSchema.pre<UserDocument>('save', function (next) {
  next();
});

UserSchema.post<Query<UserDocument, UserDocument>>('findOneAndUpdate', async function (document) {
});
