import { Inject, Injectable } from '@nestjs/common';
import {
  User,
  VerificationRequest,
  VerificationRequestService,
  VerificationRequestStatus
} from '@voltron/core-library';
import { MONGO_CONSTANTS } from '@voltron/data-library';
import dayjs from 'dayjs';
import { v4 as generateUUID } from 'uuid';

@Injectable()
export class AuthVerificationRequestService {
  constructor(
    @Inject(MONGO_CONSTANTS.Symbols.Services.VerificationRequestService)
    private readonly verificationRequestService: VerificationRequestService
  ) {
  }

  async createRegisterVerificationRequest(user: User): Promise<VerificationRequest> {
    await this.verificationRequestService.cancelAllVerificationRequestsForUser(user._id);

    const verificationRequest: VerificationRequest = await this.verificationRequestService.createVerificationRequest(
      generateUUID(),
      user._id,
      user._id,
      'User',
      dayjs().add(1, 'day').toDate()
    );

    return verificationRequest;
  }

  async completeVerificationRequest(code: string): Promise<VerificationRequest> {
    return await this.updateVerificationRequest(code, VerificationRequestStatus.COMPLETED);
  }

  async cancelVerificationRequest(code: string): Promise<VerificationRequest> {
    return await this.updateVerificationRequest(code, VerificationRequestStatus.CANCELLED);
  }

  async expireVerificationRequest(code: string): Promise<VerificationRequest> {
    return await this.updateVerificationRequest(code, VerificationRequestStatus.EXPIRED);
  }

  private async updateVerificationRequest(code: string, status: VerificationRequestStatus): Promise<VerificationRequest> {
    let verificationRequest: VerificationRequest | null = await this.verificationRequestService.findVerificationRequestByCode(code);

    if (!verificationRequest) {
      throw new Error('a verification request with the specified code could not be found');
    }

    if (verificationRequest.status !== VerificationRequestStatus.STARTED) {
      throw new Error('the verification request with the specified code has either been completed, or cancelled, or is expired');
    }

    verificationRequest = await this.verificationRequestService.updateVerificationRequestStatus(verificationRequest._id, status);

    return verificationRequest;
  }
}
