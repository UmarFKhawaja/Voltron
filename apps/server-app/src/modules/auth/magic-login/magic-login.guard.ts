import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AuthMagicLoginAuthGuard extends AuthGuard('magic-login') {
}
