import { Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthMagicLoginStrategy } from './magic-login.strategy';

@Injectable()
export class AuthMagicLoginStrategyService {
  constructor(
    private readonly strategy: AuthMagicLoginStrategy
  ) {
  }

  send(req: Request, res: Response): void {
    this.strategy.send(req, res);
  }
}
