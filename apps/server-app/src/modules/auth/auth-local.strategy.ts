import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { User } from '@voltron/core-library';
import { Strategy } from 'passport-local';
import { AuthUserService } from './auth-user.service';

@Injectable()
export class AuthLocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private userService: AuthUserService
  ) {
    super();
  }

  async validate(username: string, password: string): Promise<User | null> {
    const user: User | null = await this.userService.validateUser(username, password);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
