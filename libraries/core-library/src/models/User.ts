import { Document, Model, Query, Schema, Types } from 'mongoose';

export const UserSchema = new Schema<User, UserModel>({
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

UserSchema.virtual('id').get(function () {
  return this._id;
});

export interface IUser {
  displayName: string;
  userName: string;
  emailAddress: string;
  createdAt: Date;
  updatedAt: Date;
  accounts: Array<Types.ObjectId | Record<string, unknown>>;
}

export interface User extends IUser, Document {
  _id: string;
}

export interface UserModel extends Model<User> {
}

UserSchema.pre<User>('save', function (next) {
  next();
});

UserSchema.post<Query<User, User>>('findOneAndUpdate', async function (document) {
});
