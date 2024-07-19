import { GRPC as GRPCConnection } from '@cerbos/grpc';
import { AccessService, AccessAction, Account, User, VerificationRequest } from '@voltron/core-library';

export class CerbosAccessService implements AccessService {
  constructor(
    private readonly connection: GRPCConnection
  ) {
  }

  async checkUserAccess(principal: User, resource: User | null, action: AccessAction): Promise<boolean> {
    return true;
  }

  async checkAccountAccess(principal: User, resource: Account | null, action: AccessAction): Promise<boolean> {
    return true;
  }

  async checkVerificationRequestAccess(principal: User, resource: VerificationRequest | null, action: AccessAction): Promise<boolean> {
    return true;
  }
}
