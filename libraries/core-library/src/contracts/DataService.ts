import { Account, ProviderType, User } from '@voltron/core-library';

export interface DataService {
  createUser(displayName: string, userName: string, emailAddress: string, password: string): Promise<User>;

  getUser(id: string): Promise<User | null>;

  findUser(username: string): Promise<User | null>;

  findAccount(providerType: ProviderType, userID: string): Promise<Account | null>;
}