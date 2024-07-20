import { CheckResourceRequest, CheckResourcesResult, Principal, Resource } from '@cerbos/core';
import { GRPC as GRPCConnection } from '@cerbos/grpc';
import {
  AccessAction,
  AccessResourceKind,
  AccessRole,
  AccessService,
  Account,
  EMPTY_OBJECT_ID,
  User,
  VerificationRequest
} from '@voltron/core-library';
import { Types } from 'mongoose';

export class CerbosAccessService implements AccessService {
  constructor(
    private readonly connection: GRPCConnection
  ) {
  }

  async checkUserAccess(principal: User, resource: User | null, ...actions: AccessAction[]): Promise<boolean> {
    const request: CheckResourceRequest = {
      principal: this.createUserPrincipal(principal),
      resource: this.createUserResource(resource),
      actions
    };

    const result: CheckResourcesResult = await this.connection.checkResource(request);

    const isAllowed: boolean = result.allAllowed();

    return isAllowed;
  }

  async checkAccountAccess(principal: User, resource: Account | null, ...actions: AccessAction[]): Promise<boolean> {
    const request: CheckResourceRequest = {
      principal: this.createUserPrincipal(principal),
      resource: this.createAccountResource(resource),
      actions
    };

    const result: CheckResourcesResult = await this.connection.checkResource(request);

    const isAllowed: boolean = result.allAllowed();

    return isAllowed;
  }

  async checkVerificationRequestAccess(principal: User, resource: VerificationRequest | null, ...actions: AccessAction[]): Promise<boolean> {
    const request: CheckResourceRequest = {
      principal: this.createUserPrincipal(principal),
      resource: this.createVerificationRequestResource(resource),
      actions
    };

    const result: CheckResourcesResult = await this.connection.checkResource(request);

    const isAllowed: boolean = result.allAllowed();

    return isAllowed;
  }

  private createUserPrincipal(principal: User): Principal {
    return {
      id: principal._id.toString(),
      roles: [
        AccessRole.USER
      ],
      attr: {}
    };
  }

  private createUserResource(resource: User | null): Resource {
    return {
      id: resource?._id.toString() || EMPTY_OBJECT_ID,
      kind: AccessResourceKind.USER,
      attr: {}
    };
  }

  private createAccountResource(resource: Account | null): Resource {
    return {
      id: resource?._id.toString() || EMPTY_OBJECT_ID,
      kind: AccessResourceKind.ACCOUNT,
      attr: {
        ...(!!resource ? {
          userID: resource.user instanceof Types.ObjectId
            ? resource.user.toString()
            : resource.user['_id'] as string
        } : {})
      }
    };
  }

  private createVerificationRequestResource(resource: VerificationRequest | null): Resource {
    return {
      id: resource?._id.toString() || EMPTY_OBJECT_ID,
      kind: AccessResourceKind.VERIFICATION_REQUEST,
      attr: {
        ...(!!resource ? {
          userID: resource.userID
        } : {})
      }
    };
  }
}
