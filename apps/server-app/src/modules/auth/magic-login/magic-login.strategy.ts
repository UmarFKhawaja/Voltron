import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { User } from '@voltron/core-library';
import Strategy from 'passport-magic-login';
import { AUTH_CONSTANTS } from '../auth.constants';
import { AuthCoreService } from '../core/core.service';

@Injectable()
export class AuthMagicLoginStrategy extends PassportStrategy(Strategy, 'magic-login') {
  constructor(
    private readonly coreService: AuthCoreService
  ) {
    super(
      {
        secret: AUTH_CONSTANTS.Strategies.MagicLogin.secret,
        callbackUrl: AUTH_CONSTANTS.Strategies.MagicLogin.acceptPath,
        sendMagicLink: async (username: string, confirmationURL: string): Promise<void> => {
          await this.coreService.sendMagicLink(username, confirmationURL);
        },
        verify: async (payload: {
          destination: string
        }, callback: (error: Error | null | undefined, user: User | null | undefined) => void): Promise<void> => {
          try {
            const user: User = await this.coreService.getUserByUsername(payload.destination);

            if (!user.verifiedAt) {
              callback(new Error('the user with that username was not verified'), null);
            } else {
              callback(null, user);
            }
          } catch (error: unknown) {
            callback(error as Error, null);
          }
        },
        jwtOptions: {
          expiresIn: AUTH_CONSTANTS.Strategies.MagicLogin.expiresIn
        }
      }
    );
  }

  async validate(payload: { destination: string }): Promise<User | null> {
    try {
      return await this.coreService.checkUserByUsername(payload.destination);
    } catch (error: unknown) {
      throw new UnauthorizedException(error);
    }
  }
}
