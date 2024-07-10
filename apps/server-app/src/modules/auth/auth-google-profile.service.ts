import { Injectable } from '@nestjs/common';
import { Profile } from '@voltron/core-library';

interface Email {
  value: string;
  verified: boolean;
}

@Injectable()
export class AuthGoogleProfileService {
  async extractProfile(profile: object): Promise<Profile> {
    const {
      id,
      displayName,
      emails
    } = profile as {
      id: string;
      displayName: string;
      emails: Email[];
    };

    const emailAddress: string = emails.filter((email: Email) => email.verified).shift()?.value || '';

    const userName: string = emailAddress.split('@')[0];

    return {
      id,
      displayName,
      userName,
      emailAddress
    };
  }
}
