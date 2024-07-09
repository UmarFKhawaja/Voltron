import { Injectable } from '@nestjs/common';
import {
  VerificationRequest,
  VerificationRequestModel,
  VerificationRequestService,
  VerificationRequestStatus
} from '@voltron/core-library';
import { Types } from 'mongoose';
import { use } from 'passport';

@Injectable()
export class MongoVerificationRequestService implements VerificationRequestService {
  constructor(
    private readonly verificationRequestModel: VerificationRequestModel
  ) {
  }

  async createVerificationRequest(code: string, userID: string, resourceID: string, resourceType: string, expiresAt: Date): Promise<VerificationRequest> {
    let verificationRequest = new this.verificationRequestModel({
      code,
      userID,
      resourceID,
      resourceType,
      expiresAt,
      status: VerificationRequestStatus.STARTED
    });

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

  async cancelAllVerificationRequestsForUser(userID: string): Promise<void> {
    await this.verificationRequestModel
      .updateMany({
        $and: [
          {
            userID: { $eq: userID }
          },
          {
            resourceID: { $eq: userID }
          },
          {
            resourceType: { $eq: 'User' }
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
}
