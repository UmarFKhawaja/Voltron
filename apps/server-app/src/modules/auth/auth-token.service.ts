import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Token } from '../../types/Token';
import { User } from '../../types/User';

@Injectable()
export class AuthTokenService {
  constructor(
    private jwtService: JwtService
  ) {
  }

  async generateToken(user: User): Promise<Token> {
    const payload = {
      sub: user.id,
      displayName: user.displayName,
      userName: user.userName,
      emailAddress: user.emailAddress
    };

    return {
      access_token: this.jwtService.sign(payload)
    };
  }
}
