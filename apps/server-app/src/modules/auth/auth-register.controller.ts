import { Body, Controller, Inject, Post } from '@nestjs/common';
import { Result } from '@voltron/common-library';
import { MailService, User, VerificationRequest } from '@voltron/core-library';
import { REDIS_CONSTANTS } from '@voltron/data-library';
import { AuthURLService } from './auth-url.service';
import { AuthUserService } from './auth-user.service';
import { AuthVerificationRequestService } from './auth-verification-request.service';

@Controller('auth/register')
export class AuthRegisterController {
  constructor(
    @Inject(REDIS_CONSTANTS.Symbols.Services.MailService)
    private readonly mailService: MailService,
    private readonly urlService: AuthURLService,
    private readonly userService: AuthUserService,
    private readonly verificationRequestService: AuthVerificationRequestService
  ) {
  }

  @Post('')
  async post(@Body() {
    displayName,
    userName,
    emailAddress,
    password
  }: {
    displayName: string,
    userName: string,
    emailAddress: string,
    password: string
  }): Promise<Result<void>> {
    try {
      const user: User = await this.userService.registerUser(displayName, userName, emailAddress, password);

      const verificationRequest: VerificationRequest = await this.verificationRequestService.createRegisterVerificationRequest(user);

      const verificationURL: string = this.urlService.formatRegisterVerificationURL(verificationRequest);

      await this.mailService.sendRegisterMail(user.emailAddress, verificationURL);

      return {
        success: true,
        data: void 0
      };
    } catch (error: unknown) {
      return {
        success: false,
        error: error as Error
      };
    }
  }
}
