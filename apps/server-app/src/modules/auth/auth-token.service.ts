import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Result, Token, Session } from '@voltron/common-library';
import { User } from '@voltron/data-library';
import dayjs from 'dayjs';
import { decode } from 'jsonwebtoken';
import { JwtPayload } from 'jwt-decode';
import { v4 as generateUUID } from 'uuid';

@Injectable()
export class AuthTokenService {
  private readonly sessions: Map<string, Date>;

  constructor(
    private jwtService: JwtService
  ) {
    this.sessions = new Map<string, Date>();
  }

  async validateSession(session: Session): Promise<boolean> {
    const isKnown: boolean = this.sessions.has(session.id);

    if (!isKnown) {
      return false;
    }

    const expiresAt: Date = this.sessions.get(session.id) as Date;

    return dayjs().isBefore(dayjs(expiresAt));
  }

  async generateToken(user: User): Promise<Result<Token>> {
    const session = {
      id: generateUUID(),
      sub: user.id,
      displayName: user.displayName,
      userName: user.userName,
      emailAddress: user.emailAddress
    };

    const encodedToken: string = this.jwtService.sign(session);
    const decodedToken: JwtPayload = decode(encodedToken) as JwtPayload;

    this.sessions.set(session.id, dayjs(decodedToken.exp).toDate())

    return {
      success: true,
      data: {
        access_token: encodedToken
      }
    };
  }

  async invalidateToken(session: Session): Promise<void> {
    this.sessions.delete(session.id);
  }
}
