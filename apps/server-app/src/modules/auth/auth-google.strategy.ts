import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { User } from '@voltron/core-library';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthUserService } from './auth-user.service';
import { GOOGLE_CONSTANTS } from './auth.constants';

@Injectable()
export class AuthGoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private userService: AuthUserService
  ) {
    super({
      clientID: GOOGLE_CONSTANTS.clientID,
      clientSecret: GOOGLE_CONSTANTS.clientSecret,
      callbackURL: new URL(GOOGLE_CONSTANTS.acceptPath, GOOGLE_CONSTANTS.acceptURL).toString(),
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
      done(null, user);
    }
  }
}
