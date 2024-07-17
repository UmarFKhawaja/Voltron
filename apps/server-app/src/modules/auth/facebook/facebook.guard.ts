import { ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AuthFacebookAuthGuard extends AuthGuard('facebook') {
  constructor(
    private configService: ConfigService
  ) {
    super({
      accessType: 'offline'
    });
  }

  getAuthenticateOptions(context: ExecutionContext) {
    const { path } = context.switchToHttp().getRequest().query;

    const json: string = JSON.stringify({ path });

    const state: string = Buffer
      .from(json, 'utf-8')
      .toString('base64');

    return {
      state
    };
  }
}
