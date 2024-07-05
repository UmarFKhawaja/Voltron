import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { User } from '@voltron/core-library';
import { Profile, Strategy } from 'passport-github';
import { VerifyCallback } from 'passport-oauth2';
import { AuthUserService } from './auth-user.service';
import { GITHUB_CONSTANTS } from './auth.constants';

@Injectable()
export class AuthGitHubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(
    private userService: AuthUserService
  ) {
    super({
      clientID: GITHUB_CONSTANTS.clientID,
      clientSecret: GITHUB_CONSTANTS.clientSecret,
      callbackURL: new URL(GITHUB_CONSTANTS.acceptPath, GITHUB_CONSTANTS.acceptURL).toString(),
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback): Promise<void> {
    const user: User | null = await this.userService.getUserByGitHubID(profile.id);

    if (!user) {
      done(new Error('a user linked to the GitHub ID could not be found'));
    } else {
      done(null, user);
    }
  }
}
