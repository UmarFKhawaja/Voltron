import { Document, Model, Query, Schema } from 'mongoose';
import { VerificationRequestStatus } from './VerificationRequestStatus';

export const VerificationRequestSchema = new Schema<VerificationRequest, VerificationRequestModel>({
  code: {
    type: String,
    required: true,
    unique: true
  },
  userID: {
    type: String,
    required: true
  },
  resourceID: {
    type: String,
    required: true
  },
  resourceType: {
    type: String,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    required: true
  }
});

VerificationRequestSchema.virtual('id').get(function () {
  return this._id;
});

export interface IVerificationRequest {
  code: string;
  userID: string;
  resourceID: string;
  resourceType: string;
  expiresAt: Date;
  status: VerificationRequestStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface VerificationRequest extends IVerificationRequest, Document {
  _id: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface VerificationRequestModel extends Model<VerificationRequest> {
}

VerificationRequestSchema.pre<VerificationRequest>('save', function (next) {
  next();
});

// eslint-disable-next-line @typescript-eslint/no-empty-function
VerificationRequestSchema.post<Query<VerificationRequest, VerificationRequest>>('findOneAndUpdate', async function (document) {
});
