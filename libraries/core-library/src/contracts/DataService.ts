import { Account, ProviderType, User } from '@voltron/core-library';

export interface DataService {
  createUser(displayName: string, userName: string, emailAddress: string, password: string): Promise<User>;

  updateUser(userID: string, displayName: string, userName: string): Promise<User | null>;

  getUserByID(id: string): Promise<User | null>;

  getUserByProvider(providerType: ProviderType, providerID: string): Promise<User | null>;

  findUser(username: string): Promise<User | null>;

  findAccount(providerType: ProviderType, userID: string): Promise<Account | null>;
}
