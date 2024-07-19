import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { User } from '@voltron/core-library';
import { Strategy } from 'passport-local';
import { AuthCoreService } from '../core/core.service';

@Injectable()
export class AuthPasswordStrategy extends PassportStrategy(Strategy, 'password') {
  constructor(
    private coreService: AuthCoreService
  ) {
    super();
  }

  async validate(username: string, password: string): Promise<User> {
    try {
      return await this.coreService.checkUserByUsernameAndPassword(username, password);
    } catch (error: unknown) {
      throw new UnauthorizedException(error);
    }
  }
}
