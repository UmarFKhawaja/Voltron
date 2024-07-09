import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { User } from '@voltron/core-library';
import { Profile, Strategy } from 'passport-github';
import { VerifyCallback } from 'passport-oauth2';
import { AuthUserService } from './auth-user.service';
import { AUTH_CONSTANTS } from './auth.constants';

@Injectable()
export class AuthGitHubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(
    private userService: AuthUserService
  ) {
    super({
      clientID: AUTH_CONSTANTS.Strategies.GitHub.clientID,
      clientSecret: AUTH_CONSTANTS.Strategies.GitHub.clientSecret,
      callbackURL: new URL(AUTH_CONSTANTS.Strategies.GitHub.acceptPath, AUTH_CONSTANTS.Strategies.GitHub.acceptURL).toString()
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback): Promise<void> {
    const user: User | null = await this.userService.findUserByGitHubID(profile.id);

    if (!user) {
      done(new Error('a user linked to the GitHub ID could not be found'));
    } else {
      if (!user.verifiedAt) {
        done(new Error('the user linked to the GitHub ID was not verified'));
      } else {
        done(null, user);
      }
    }
  }
}
