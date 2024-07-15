import { Inject, Injectable } from '@nestjs/common';
import {
  User,
  VerificationRequest,
  VerificationRequestPurpose,
  VerificationRequestService,
  VerificationRequestStatus
} from '@voltron/core-library';
import { MONGO_CONSTANTS } from '@voltron/data-library';

@Injectable()
export class AuthVerificationRequestService {
  constructor(
    @Inject(MONGO_CONSTANTS.Symbols.Services.VerificationRequestService)
    private readonly verificationRequestService: VerificationRequestService
  ) {
  }

  async recreateVerificationRequest(user: User, purpose: VerificationRequestPurpose): Promise<VerificationRequest | null> {
    return await this.verificationRequestService.recreateVerificationRequest(user._id, purpose);
  }

  async createRegisterVerificationRequest(user: User): Promise<VerificationRequest> {
    await this.verificationRequestService.cancelAllVerificationRequestsForUser(user._id, VerificationRequestPurpose.REGISTER);

    const verificationRequest: VerificationRequest = await this.verificationRequestService.createVerificationRequest(
      user._id,
      user._id,
      'User',
      {},
      VerificationRequestPurpose.REGISTER
    );

    return verificationRequest;
  }

  async createChangeEmailVerificationRequest(user: User, emailAddress: string, status: 'OLD_EMAIL_ADDRESS_NOT_CONFIRMED' | 'NEW_EMAIL_ADDRESS_NOT_CONFIRMED'): Promise<VerificationRequest> {
    if (!emailAddress) {
      throw new Error('a new email address has not been provided');
    }

    await this.verificationRequestService.cancelAllVerificationRequestsForUser(user._id, VerificationRequestPurpose.CHANGE_EMAIL_ADDRESS);

    const verificationRequest: VerificationRequest = await this.verificationRequestService.createVerificationRequest(
      user._id,
      user._id,
      'User',
      {
        status,
        oldEmailAddress: user.emailAddress,
        newEmailAddress: emailAddress
      },
      VerificationRequestPurpose.CHANGE_EMAIL_ADDRESS
    );

    return verificationRequest;
  }

  async completeVerificationRequest(user: User, code: string): Promise<VerificationRequest> {
    return await this.updateVerificationRequest(user, code, VerificationRequestStatus.COMPLETED);
  }

  async cancelVerificationRequest(user: User, code: string): Promise<VerificationRequest> {
    return await this.updateVerificationRequest(user, code, VerificationRequestStatus.CANCELLED);
  }

  async expireVerificationRequest(user: User, code: string): Promise<VerificationRequest> {
    return await this.updateVerificationRequest(user, code, VerificationRequestStatus.EXPIRED);
  }

  async findVerificationRequestByCode(code: string): Promise<VerificationRequest | null> {
    return await this.verificationRequestService.findVerificationRequestByCode(code);
  }

  async findVerificationRequestByUserAndPurpose(user: User, purpose: VerificationRequestPurpose): Promise<VerificationRequest | null> {
    if (!user) {
      throw new Error('a user must be provided when finding verification requests by user');
    }

    return await this.verificationRequestService.findVerificationRequestsByUserIDAndPurpose(user._id, purpose);
  }

  private async updateVerificationRequest(user: User, code: string, status: VerificationRequestStatus): Promise<VerificationRequest> {
    let verificationRequest: VerificationRequest | null = await this.verificationRequestService.findVerificationRequestByCode(code);

    if (!verificationRequest) {
      throw new Error('a verification request with the specified code could not be found');
    }

    if (verificationRequest.userID !== user._id.toString()) {
      throw new Error('the verification request with the specified code belongs to a different user');
    }

    if (verificationRequest.status !== VerificationRequestStatus.STARTED) {
      throw new Error('the verification request with the specified code has either been completed, or cancelled, or is expired');
    }

    verificationRequest = await this.verificationRequestService.updateVerificationRequestStatus(verificationRequest._id, status);

    return verificationRequest;
  }

  async getUserForVerificationRequest(code: string): Promise<User> {
    return await this.verificationRequestService.getUserForVerificationRequest(code);
  }
}
