import { Account } from './Account';

export interface User {
  id: string;
  displayName: string;
  userName: string;
  emailAddress: string;
  createdAt: Date;
  updatedAt: Date;
  accounts: Account[];
}
