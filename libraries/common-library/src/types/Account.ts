import { ProviderType } from './ProviderType';

export interface Account {
  id: string;
  providerType: ProviderType;
  providerInfo: string;
}
