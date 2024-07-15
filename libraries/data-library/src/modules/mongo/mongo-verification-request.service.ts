import { Injectable } from '@nestjs/common';
import {
  User, UserModel,
  VerificationRequest,
  VerificationRequestModel,
  VerificationRequestPurpose,
  VerificationRequestService,
  VerificationRequestStatus
} from '@voltron/core-library';
import dayjs from 'dayjs';
import { Types } from 'mongoose';
import { v4 as generateUUID } from 'uuid';

@Injectable()
export class MongoVerificationRequestService implements VerificationRequestService {
  constructor(
    private readonly userModel: UserModel,
    private readonly verificationRequestModel: VerificationRequestModel
  ) {
  }

  async recreateVerificationRequest(userID: string, purpose: VerificationRequestPurpose): Promise<VerificationRequest> {
    let verificationRequest: VerificationRequest | null = await this.verificationRequestModel
      .findOne({
        $and: [
          {
            userID: { $eq: userID }
          },
          {
            purpose: { $eq: purpose }
          },
          {
            $or: [
              {
                status: { $eq: VerificationRequestStatus.STARTED }
              },
              {
                status: { $eq: VerificationRequestStatus.EXPIRED }
              }
            ]
          }
        ]
      })
      .sort({
        'expiresAt': 'desc'
      })
      .exec();

    if (!verificationRequest) {
      throw new Error('a verification request with the specified purpose could not be found');
    }

    await this.updateVerificationRequestStatus(verificationRequest._id, VerificationRequestStatus.CANCELLED);

    verificationRequest = new this.verificationRequestModel({
      code: generateUUID(),
      userID: verificationRequest.userID,
      resourceID: verificationRequest.resourceID,
      resourceType: verificationRequest.resourceType,
      details: verificationRequest.details,
      purpose: verificationRequest.purpose,
      status: VerificationRequestStatus.STARTED,
      expiresAt: dayjs().add(1, 'day').toDate()
    });

    verificationRequest.markModified('details');

    verificationRequest = await verificationRequest.save();

    return verificationRequest;
  }

  async createVerificationRequest(userID: string, resourceID: string, resourceType: string, details: object, purpose: VerificationRequestPurpose): Promise<VerificationRequest> {
    let verificationRequest = new this.verificationRequestModel({
      code: generateUUID(),
      userID,
      resourceID,
      resourceType,
      details,
      purpose,
      status: VerificationRequestStatus.STARTED,
      expiresAt: dayjs().add(1, 'day').toDate()
    });

    verificationRequest.markModified('details');

    verificationRequest = await verificationRequest.save();

    return verificationRequest;
  }

  async updateVerificationRequestStatus(verificationRequestID: string, verificationRequestStatus: VerificationRequestStatus): Promise<VerificationRequest> {
    const verificationRequest: VerificationRequest | null = await this.verificationRequestModel.findOneAndUpdate({
      _id: { $eq: new Types.ObjectId(verificationRequestID) }
    }, {
      $set: {
        status: verificationRequestStatus
      }
    }, {
      new: true
    })
      .exec();

    if (!verificationRequest) {
      throw new Error('a verification request with the specified ID could not be found');
    }

    return verificationRequest;
  }

  async cancelAllVerificationRequestsForUser(userID: string, purpose: VerificationRequestPurpose): Promise<void> {
    await this.verificationRequestModel
      .updateMany({
        $and: [
          {
            userID: { $eq: userID }
          },
          {
            purpose: { $eq: purpose }
          },
          {
            status: { $eq: VerificationRequestStatus.STARTED }
          }
        ]
      }, {
        $set: {
          status: VerificationRequestStatus.CANCELLED
        }
      })
      .exec();
  }

  async findVerificationRequestByCode(code: string): Promise<VerificationRequest | null> {
    const verificationRequest: VerificationRequest | null = await this.verificationRequestModel
      .findOne({
        code: { $eq: code }
      })
      .exec();

    return verificationRequest;
  }

  async findVerificationRequestsByUserIDAndPurpose(userID: string, purpose: VerificationRequestPurpose): Promise<VerificationRequest | null> {
    const verificationRequest: VerificationRequest | null = await this.verificationRequestModel
      .findOne({
        $and: [
          {
            userID: { $eq: userID }
          },
          {
            purpose: { $eq: purpose }
          },
          {
            status: { $eq: VerificationRequestStatus.STARTED }
          }
        ]
      })
      .exec();

    return verificationRequest;
  }

  async getUserForVerificationRequest(code: string): Promise<User> {
    const verificationRequest: VerificationRequest | null = await this.verificationRequestModel
      .findOne({
        code: { $eq: code }
      })
      .exec();

    if (!verificationRequest) {
      throw new Error('a verification request with the specified code could not be found');
    }

    const user: User | null = await this.userModel
      .findOne({
        _id: { $eq: new Types.ObjectId(verificationRequest.userID) }
      })
      .exec();

    if (!user) {
      throw new Error('a user linked to the verification request with the specified code could not be found');
    }

    return user;
  }
}
