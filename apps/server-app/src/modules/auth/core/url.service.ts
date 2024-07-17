import { Injectable } from '@nestjs/common';
import { VerificationRequest } from '@voltron/core-library';
import { AUTH_CONSTANTS } from '../auth.constants';

@Injectable()
export class AuthURLService {
  formatRegisterVerificationURL(verificationRequest: VerificationRequest): string {
    const url: URL = new URL(AUTH_CONSTANTS.Actions.ActivateAccount.path, AUTH_CONSTANTS.Actions.baseURL);

    url.searchParams.set('code', verificationRequest.code);

    return url.toString();
  }

  formatRecoverAccountConfirmationURL(token: string): string {
    const url: URL = new URL(AUTH_CONSTANTS.Actions.RecoverAccount.path, AUTH_CONSTANTS.Actions.baseURL);

    url.searchParams.set('token', token);

    return url.toString();
  }

  formatConfirmEmailAddressChangeConfirmationURL(token: string, code: string): string {
    const url: URL = new URL(AUTH_CONSTANTS.Actions.ConfirmEmailAddressChange.path, AUTH_CONSTANTS.Actions.baseURL);

    url.searchParams.set('token', token);
    url.searchParams.set('code', code);

    return url.toString();
  }

  formatCompleteEmailAddressChangeConfirmationURL(token: string, code: string): string {
    const url: URL = new URL(AUTH_CONSTANTS.Actions.CompleteEmailAddressChange.path, AUTH_CONSTANTS.Actions.baseURL);

    url.searchParams.set('token', token);
    url.searchParams.set('code', code);

    return url.toString();
  }
}
