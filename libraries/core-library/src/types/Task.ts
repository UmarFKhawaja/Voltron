export type Task =
  | SendRegisterMailTask
  | SendLoginWithMagicLoginMailTask
  | SendResetAccountMailTask
  | SendConfirmEmailAddressChangeMailTask
  | SendCompleteEmailAddressChangeMailTask;

export interface BaseTask {
  type: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SendRegisterMailTask extends BaseTask {
  type: 'SEND_REGISTER_MAIL';
  emailAddress: string;
  verificationURL: string;
}

export interface SendLoginWithMagicLoginMailTask extends BaseTask {
  type: 'SEND_LOGIN_WITH_MAGIC_LOGIN_MAIL';
  emailAddress: string;
  confirmationURL: string;
}

export interface SendResetAccountMailTask extends BaseTask {
  type: 'SEND_RESET_PASSWORD_MAIL';
  emailAddress: string;
  confirmationURL: string;
}

export interface SendConfirmEmailAddressChangeMailTask extends BaseTask {
  type: 'SEND_CONFIRM_EMAIL_ADDRESS_CHANGE_MAIL';
  emailAddress: string;
  confirmationURL: string;
}

export interface SendCompleteEmailAddressChangeMailTask extends BaseTask {
  type: 'SEND_COMPLETE_EMAIL_ADDRESS_CHANGE_MAIL';
  emailAddress: string;
  confirmationURL: string;
}
