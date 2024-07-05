import { Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthGitHubStrategy } from './auth-github.strategy';
import { AuthGoogleStrategy } from './auth-google.strategy';
import { AuthJwtStrategy } from './auth-jwt.strategy';
import { AuthLocalStrategy } from './auth-local.strategy';
import { AuthMagicLoginStrategy } from './auth-magic-login.strategy';

@Injectable()
export class AuthStrategyService {
  constructor(
    private jwtStrategy: AuthJwtStrategy,
    private localStrategy: AuthLocalStrategy,
    private magicLoginStrategy: AuthMagicLoginStrategy,
    private githubStrategy: AuthGitHubStrategy,
    private googleStrategy: AuthGoogleStrategy
  ) {
  }

  async sendNotification(req: Request, res: Response): Promise<void> {
    this.magicLoginStrategy.send(req, res);
  }
}
