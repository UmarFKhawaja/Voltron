import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Session } from '@voltron/common-library';
import { User } from '@voltron/core-library';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AUTH_CONSTANTS } from '../auth.constants';
import { AuthCoreService } from '../core/core.service';
import { AuthTokenService } from '../core/token.service';

const {
  fromAuthHeaderAsBearerToken,
  fromExtractors,
  fromUrlQueryParameter
} = ExtractJwt;

function fromAuthCookie(req: Request): string | null {
  // TODO : implement auth cookies
  return null;
}

@Injectable()
export class AuthJwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly coreService: AuthCoreService,
    private readonly tokenService: AuthTokenService
  ) {
    super({
      jwtFromRequest: fromExtractors([
        fromAuthCookie,
        fromAuthHeaderAsBearerToken(),
        fromUrlQueryParameter('token')
      ]),
      ignoreExpiration: false,
      secretOrKey: AUTH_CONSTANTS.Strategies.JWT.secret
    });
  }

  async validate(session: Session): Promise<User | null> {
    const hasValidated: boolean = await this.tokenService.validateSession(session);

    if (!hasValidated) {
      throw new UnauthorizedException();
    }

    try {
      return await this.coreService.checkUserByID(session.sub);
    } catch (error: unknown) {
      throw new UnauthorizedException(error);
    }
  }
}
