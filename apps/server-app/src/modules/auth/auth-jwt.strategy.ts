import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Session } from '@voltron/common-library';
import { User } from '@voltron/data-library';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthTokenService } from './auth-token.service';
import { AuthUserService } from './auth-user.service';
import { JWT_CONSTANTS } from './auth.constants';

@Injectable()
export class AuthJwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly tokenService: AuthTokenService,
    private readonly userService: AuthUserService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWT_CONSTANTS.secret
    });
  }

  async validate(session: Session): Promise<User | null> {
    if (await this.tokenService.validateSession(session)) {
      throw new UnauthorizedException();
    }

    const user: User | null = await this.userService.getUser(session.sub);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
