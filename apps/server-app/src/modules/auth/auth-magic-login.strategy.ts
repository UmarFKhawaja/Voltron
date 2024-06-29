import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import Strategy from 'passport-magic-login';
import { User } from '../../types/User';
import { AuthUserService } from './auth-user.service';
import { MAGIC_LOGIN_CONSTANTS } from './auth.constants';

@Injectable()
export class AuthMagicLoginStrategy extends PassportStrategy(Strategy, 'magic-login') {
  constructor(
    private userService: AuthUserService
  ) {
    super(
      {
        secret: MAGIC_LOGIN_CONSTANTS.secret,
        callbackUrl: MAGIC_LOGIN_CONSTANTS.acceptPath,
        sendMagicLink: async (emailAddress: string, confirmURL: string): Promise<void> => {
          const url: URL = new URL(confirmURL, MAGIC_LOGIN_CONSTANTS.baseURL);

          Logger.log(emailAddress);
          Logger.log(url.toString());
        },
        verify: async (payload: { destination: string }, callback: (error: Error | null | undefined, user: User | null | undefined) => void): Promise<void> => {
          try {
            const user: User | null = await this.userService.identifyUser(payload.destination);

            if (!user) {
              callback(new Error('user not found'), null);
            } else {
              callback(null, user);
            }
          } catch (error: unknown) {
            callback(error as Error, null);
          }
        },
        jwtOptions: {
          expiresIn: MAGIC_LOGIN_CONSTANTS.expiresIn
        }
      }
    );
  }

  async validate(payload: { destination: string }): Promise<User | null> {
    const user: User | null = await this.userService.identifyUser(payload.destination);

    return user;
  }
}
