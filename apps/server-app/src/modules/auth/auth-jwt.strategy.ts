import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Session } from '@voltron/common-library';
import { User } from '@voltron/core-library';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthTokenService } from './auth-token.service';
import { AuthUserService } from './auth-user.service';
import { AUTH_CONSTANTS } from './auth.constants';

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
    private readonly tokenService: AuthTokenService,
    private readonly userService: AuthUserService
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
      const user: User = await this.userService.getUserByID(session.sub);

      if (!user.verifiedAt) {
        throw new Error('the user with the specified user ID is not verified');
      }

      return user;
    } catch (error: unknown) {
      throw new UnauthorizedException(error);
    }
  }
}
