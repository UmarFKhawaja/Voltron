import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Result, Session, Token } from '@voltron/common-library';
import { Account, ProviderType, SessionService, User } from '@voltron/core-library';
import { REDIS_CONSTANTS } from '@voltron/data-library';
import dayjs from 'dayjs';
import { decode } from 'jsonwebtoken';
import { JwtPayload } from 'jwt-decode';
import { v4 as generateUUID } from 'uuid';

@Injectable()
export class AuthTokenService {
  constructor(
    private jwtService: JwtService,
    @Inject(REDIS_CONSTANTS.Symbols.Services.SessionService)
    private sessionService: SessionService
  ) {
  }

  async validateSession(session: Session): Promise<boolean> {
    const isKnown: boolean = await this.sessionService.hasSessionExpiry(session.id);

    if (!isKnown) {
      return false;
    }

    const expiresAt: Date = await this.sessionService.getSessionExpiry(session.id);

    return dayjs().isBefore(dayjs(expiresAt));
  }

  async generateToken(user: User | null): Promise<Result<Token>> {
    if (!user) {
      return {
        success: false,
        error: new UnauthorizedException()
      };
    }

    const session: Session = {
      id: generateUUID(),
      sub: user.id,
      displayName: user.displayName,
      userName: user.userName,
      emailAddress: user.emailAddress,
      accounts: {
        local: user.accounts
          .map((account) => account as unknown as Account)
          .some((account: Account): boolean => account.providerType === ProviderType.LOCAL),
        social: {
          github: user.accounts
            .map((account) => account as unknown as Account)
            .some((account: Account): boolean => account.providerType === ProviderType.GITHUB),
          google: user.accounts
            .map((account) => account as unknown as Account)
            .some((account: Account): boolean => account.providerType === ProviderType.GOOGLE)
        }
      }
    };

    const encodedToken: string = this.jwtService.sign(session);
    const decodedToken: JwtPayload = decode(encodedToken) as JwtPayload;
    const timestamp: number = (decodedToken.exp || 0) * 1000;

    await this.sessionService.setSessionExpiry(session.id, dayjs(timestamp).toDate());

    return {
      success: true,
      data: {
        access_token: encodedToken
      }
    };
  }

  async invalidateToken(session: Session): Promise<void> {
    await this.sessionService.unsetSessionExpiry(session.id);
  }
}
