import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { User } from '@voltron/core-library';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthUserService } from './auth-user.service';
import { AUTH_CONSTANTS } from './auth.constants';

@Injectable()
export class AuthGoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private userService: AuthUserService
  ) {
    super({
      clientID: AUTH_CONSTANTS.Strategies.Google.clientID,
      clientSecret: AUTH_CONSTANTS.Strategies.Google.clientSecret,
      callbackURL: new URL(AUTH_CONSTANTS.Strategies.Google.acceptPath, AUTH_CONSTANTS.Strategies.Google.acceptURL).toString(),
      scope: [
        'email',
        'profile'
      ]
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback): Promise<void> {
    const user: User | null = await this.userService.findUserByGoogleID(profile.id);

    if (!user) {
      done(new Error('a user linked to the Google ID could not be found'));
    } else {
      if (!user.verifiedAt) {
        done(new Error('the user linked to the Google ID was not verified'));
      } else {
        done(null, user);
      }
    }
  }
}
