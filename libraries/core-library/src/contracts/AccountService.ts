import { Account, ProviderType } from '../models';

export interface AccountService {
  findAccount(providerType: ProviderType, userID: string): Promise<Account | null>;
}
