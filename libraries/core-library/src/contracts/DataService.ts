import { Account, ProviderType, User } from '@voltron/core-library';

export interface DataService {
  createUser(displayName: string, userName: string, emailAddress: string, password: string): Promise<User>;

  updateUser(userID: string, displayName: string, userName: string, emailAddress: string): Promise<User>;

  setPassword(userID: string, saltHash: string): Promise<User>;

  unsetPassword(userID: string): Promise<User>;

  getUserByID(id: string): Promise<User>;

  findUserByUsername(username: string): Promise<User | null>;

  findUserByProvider(providerType: ProviderType, providerID: string): Promise<User | null>;

  findAccount(providerType: ProviderType, userID: string): Promise<Account | null>;
}
