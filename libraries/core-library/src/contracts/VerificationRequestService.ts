import { VerificationRequest, VerificationRequestStatus } from '../models';

export interface VerificationRequestService {
  createVerificationRequest(code: string, userID: string, resourceID: string, resourceType: string, expiresAt: Date): Promise<VerificationRequest>;

  updateVerificationRequestStatus(verificationRequestID: string, verificationRequestStatus: VerificationRequestStatus): Promise<VerificationRequest>;

  cancelAllVerificationRequestsForUser(userID: string): Promise<void>;

  findVerificationRequestByCode(code: string): Promise<VerificationRequest | null>;
}
