import { Inject, Injectable, Logger } from '@nestjs/common';
import { MailService, Task } from '@voltron/core-library';
import { SIMPLE_CONSTANTS } from '@voltron/services-library';

@Injectable()
export class TaskService {
  constructor(
    @Inject(SIMPLE_CONSTANTS.Symbols.Services.MailService)
    private readonly mailService: MailService
  ) {
  }

  async handleTask(task: Task): Promise<void> {
    switch (task.type) {
      case 'SEND_REGISTER_MAIL':
        await this.mailService.sendRegisterMail(task.emailAddress, task.verificationURL);
        break;

      case 'SEND_LOGIN_WITH_MAGIC_LOGIN_MAIL':
        await this.mailService.sendLoginWithMagicLoginMail(task.emailAddress, task.confirmationURL);
        break;

      case 'SEND_RESET_PASSWORD_MAIL':
        await this.mailService.sendResetPasswordMail(task.emailAddress, task.confirmationURL);
        break;

      case 'SEND_CONFIRM_EMAIL_ADDRESS_CHANGE_MAIL':
        await this.mailService.sendConfirmEmailAddressChange(task.oldEmailAddress, task.newEmailAddress, task.confirmationURL);
        break;

      case 'SEND_COMPLETE_EMAIL_ADDRESS_CHANGE_MAIL':
        await this.mailService.sendCompleteEmailAddressChange(task.oldEmailAddress, task.newEmailAddress, task.confirmationURL);
        break;

      default:
        Logger.warn(task);
        break;
    }
  }
}
