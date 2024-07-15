import { EmailAddressChanged, Session } from '@voltron/common-library';
import { VerificationRequest } from '@voltron/core-library';
import { Request } from 'express';
import { decode } from 'jsonwebtoken';

export function extractToken(req: Request): string {
  const token: string = req.headers.authorization?.replace(/^Bearer /, '') ?? '';

  return token;
}

export function extractSession(req: Request): Session | null {
  const token: string = req.headers.authorization?.replace(/^Bearer /, '') ?? '';

  if (!token) {
    return null;
  }

  const session: Session = decode(token) as Session;

  return session;
}

export function createEmailAddressChanged(verificationRequest: VerificationRequest | null): EmailAddressChanged | null {
  const emailAddressChanged: EmailAddressChanged | null = verificationRequest
    ? {
      code: verificationRequest.code,
      ...verificationRequest.details
    } as EmailAddressChanged : null;

  return emailAddressChanged;
}
