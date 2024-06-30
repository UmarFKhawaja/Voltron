import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Result, Token, User } from '@voltron/common-library';

@Injectable()
export class AuthTokenService {
  constructor(
    private jwtService: JwtService
  ) {
  }

  async generateToken(user: User): Promise<Result<Token>> {
    const payload = {
      sub: user.id,
      displayName: user.displayName,
      userName: user.userName,
      emailAddress: user.emailAddress
    };

    return {
      success: true,
      data: {
        access_token: this.jwtService.sign(payload)
      }
    };
  }
}
