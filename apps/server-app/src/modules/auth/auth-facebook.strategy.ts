import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ProviderType, User } from '@voltron/core-library';
import { Profile, Strategy } from 'passport-facebook';
import { VerifyCallback } from 'passport-oauth2';
import { AuthFacebookProfileService } from './auth-facebook-profile.service';
import { AuthUserService } from './auth-user.service';
import { AUTH_CONSTANTS } from './auth.constants';

@Injectable()
export class AuthFacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(
    private readonly userService: AuthUserService,
    private readonly profileService: AuthFacebookProfileService
  ) {
    super({
      clientID: AUTH_CONSTANTS.Strategies.Facebook.clientID,
      clientSecret: AUTH_CONSTANTS.Strategies.Facebook.clientSecret,
      callbackURL: new URL(AUTH_CONSTANTS.Strategies.Facebook.acceptPath, AUTH_CONSTANTS.Strategies.Facebook.acceptURL).toString(),
      scope: [
        'email',
        'public_profile'
      ],
      profileFields: [
        'id',
        'displayName',
        'email'
      ]
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback): Promise<void> {
    const {
      id,
      displayName,
      userName,
      emailAddress
    } = await this.profileService.extractProfile(profile);

    const user: User | null = await this.userService.ensureUserWithProvider(displayName, userName, emailAddress, ProviderType.FACEBOOK, id);

    if (!user) {
      done(new Error('a user linked to the Facebook ID could not be found'));
    } else {
      if (!user.verifiedAt) {
        done(new Error('the user linked to the Facebook ID was not verified'));
      } else {
        done(null, user);
      }
    }
  }
}
