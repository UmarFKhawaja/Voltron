export interface Session {
  id: string;
  sub: string;
  displayName: string;
  userName: string;
  emailAddress: string;
  accounts: {
    local: boolean;
    social: {
      github: boolean;
      google: boolean;
    };
  }
}
