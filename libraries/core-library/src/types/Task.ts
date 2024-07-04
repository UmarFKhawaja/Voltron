export type Task =
  | SendRegisterMailTask
  | SendLoginWithMagicLoginMailTask;

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
