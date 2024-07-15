export interface Information {
  emailAddressChanged: EmailAddressChanged | null;
}

export type EmailAddressChangedStatus =
  | 'OLD_EMAIL_ADDRESS_NOT_CONFIRMED'
  | 'NEW_EMAIL_ADDRESS_NOT_CONFIRMED';

export interface EmailAddressChanged {
  code: string;
  status: EmailAddressChangedStatus;
  oldEmailAddress: string;
  newEmailAddress: string;
}
