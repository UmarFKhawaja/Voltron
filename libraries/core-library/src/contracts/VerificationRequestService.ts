import { User, VerificationRequest, VerificationRequestPurpose, VerificationRequestStatus } from '../models';

export interface VerificationRequestService {
  recreateVerificationRequest(userID: string, purpose: VerificationRequestPurpose): Promise<VerificationRequest>;

  createVerificationRequest(userID: string, resourceID: string, resourceType: string, details: object, purpose: VerificationRequestPurpose): Promise<VerificationRequest>;

  updateVerificationRequestStatus(verificationRequestID: string, verificationRequestStatus: VerificationRequestStatus): Promise<VerificationRequest>;

  cancelAllVerificationRequestsForUser(userID: string, purpose: VerificationRequestPurpose): Promise<void>;

  findVerificationRequestByCode(code: string): Promise<VerificationRequest | null>;

  findVerificationRequestsByUserIDAndPurpose(userID: string, purpose: VerificationRequestPurpose): Promise<VerificationRequest | null>;

  getUserForVerificationRequest(code: string): Promise<User>;
}
