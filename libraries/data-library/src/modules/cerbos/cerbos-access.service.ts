import { GRPC as Connector } from '@cerbos/grpc';
import { AccessService, Account, User, VerificationRequest } from '@voltron/core-library';
import { ConnectorFactory } from './cerbos.types';

export class CerbosAccessService implements AccessService {
  private connector: Connector;

  constructor(
    private readonly makeConnector: ConnectorFactory
  ) {
    this.connector = this.makeConnector();
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
