import { Account, User, VerificationRequest } from '../models';

export interface AccessService {
  checkUserAccess(principal: User, user: User, action: string): Promise<boolean>;

  checkAccountAccess(principal: User, account: Account, action: string): Promise<boolean>;

  checkVerificationRequestAccess(principal: User, verificationRequest: VerificationRequest, action: string): Promise<boolean>;
}
