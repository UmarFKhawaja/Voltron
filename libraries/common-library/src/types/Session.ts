export interface Session {
  id: string;
  sub: string;
  displayName: string;
  userName: string;
  emailAddress: string;
  accounts: {
    local: boolean;
    social: {
      facebook: boolean;
      google: boolean;
    };
  }
}
