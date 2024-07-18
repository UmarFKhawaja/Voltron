import { GRPC as GRPCConnection } from '@cerbos/grpc';
import { AccessService, Account, User, VerificationRequest } from '@voltron/core-library';

export class CerbosAccessService implements AccessService {
  constructor(
    private readonly connection: GRPCConnection
  ) {
  }

  async checkUserAccess(principal: User, user: User, action: string): Promise<boolean> {
    return true;
  }

  async checkAccountAccess(principal: User, account: Account, action: string): Promise<boolean> {
    return true;
  }

  async checkVerificationRequestAccess(principal: User, verificationRequest: VerificationRequest, action: string): Promise<boolean> {
    return true;
  }
}
