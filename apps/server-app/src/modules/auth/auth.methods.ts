import { Session } from '@voltron/common-library';
import { Request } from 'express';
import { decode } from 'jsonwebtoken';

export function extractSession(req: Request): Session | null {
  const token: string = req.headers.authorization?.replace(/^Bearer /, '') ?? '';

  if (!token) {
    return null;
  }

  const session: Session = decode(token) as Session;

  return session;
}
