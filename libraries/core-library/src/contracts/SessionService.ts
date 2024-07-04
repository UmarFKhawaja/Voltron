export interface SessionService {
  hasSessionExpiry(id: string): Promise<boolean>;

  getSessionExpiry(id: string): Promise<Date>;

  setSessionExpiry(id: string, expiresAt: Date): Promise<void>;

  unsetSessionExpiry(id: string): Promise<void>;
}
