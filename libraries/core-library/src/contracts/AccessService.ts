import { Account, User, VerificationRequest } from '../models';
import { AccessAction } from '../types';

export interface AccessService {
  checkUserAccess(principal: User, resource: User | null, ...actions: AccessAction[]): Promise<boolean>;

  checkAccountAccess(principal: User, resource: Account | null, ...actions: AccessAction[]): Promise<boolean>;

  checkVerificationRequestAccess(principal: User, resource: VerificationRequest | null, ...actions: AccessAction[]): Promise<boolean>;
}
