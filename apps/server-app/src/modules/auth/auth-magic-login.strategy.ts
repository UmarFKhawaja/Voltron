import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { MailService, User } from '@voltron/core-library';
import { REDIS_CONSTANTS } from '@voltron/data-library';
import Strategy from 'passport-magic-login';
import { AuthUserService } from './auth-user.service';
import { MAGIC_LOGIN_CONSTANTS } from './auth.constants';

@Injectable()
export class AuthMagicLoginStrategy extends PassportStrategy(Strategy, 'magic-login') {
  constructor(
    @Inject(REDIS_CONSTANTS.Symbols.Services.MailService)
    private mailService: MailService,
    private userService: AuthUserService
  ) {
    super(
      {
        secret: MAGIC_LOGIN_CONSTANTS.secret,
        callbackUrl: MAGIC_LOGIN_CONSTANTS.acceptPath,
        sendMagicLink: async (username: string, confirmationURL: string): Promise<void> => {
          const user: User | null = await this.userService.findUserByUsername(username);

          if (!user) {
            throw new Error('a user with that username could not be found');
          }

          const magicLoginConfirmationURL: string = new URL(confirmationURL, MAGIC_LOGIN_CONSTANTS.baseURL).toString();

          const isSuccess: boolean = await this.mailService.sendLoginWithMagicLoginMail(user.emailAddress, magicLoginConfirmationURL);

          if (!isSuccess) {
            throw new Error('an email containing the confirmation link could not be sent');
          }
        },
        verify: async (payload: {
          destination: string
        }, callback: (error: Error | null | undefined, user: User | null | undefined) => void): Promise<void> => {
          try {
            const user: User | null = await this.userService.findUserByUsername(payload.destination);

            if (!user) {
              callback(new Error('a user with that username could not be found'), null);
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
    const user: User | null = await this.userService.findUserByUsername(payload.destination);

    return user;
  }
}
