import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { TokenPayload, User } from '@voltron/common-library';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthUserService } from './auth-user.service';
import { JWT_CONSTANTS } from './auth.constants';

@Injectable()
export class AuthJwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: AuthUserService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWT_CONSTANTS.secret
    });
  }

  async validate(payload: TokenPayload): Promise<User | null> {
    const user: User | null = await this.userService.getUser(payload.sub);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
