import { Injectable, Logger } from '@nestjs/common';
import { MailService, Task, TaskService } from '@voltron/core-library';

@Injectable()
export class SimpleTaskService implements TaskService {
  constructor(
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
        await this.mailService.sendConfirmEmailAddressChangeMail(task.oldEmailAddress, task.newEmailAddress, task.confirmationURL);
        break;

      case 'SEND_COMPLETE_EMAIL_ADDRESS_CHANGE_MAIL':
        await this.mailService.sendCompleteEmailAddressChangeMail(task.oldEmailAddress, task.newEmailAddress, task.confirmationURL);
        break;

      default:
        Logger.warn(task);
        break;
    }
  }
}
