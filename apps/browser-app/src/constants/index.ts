export const ACCESS_TOKEN: string = 'access-token';

export const MESSAGES = {
  REGISTER: {
    CHECK: 'check-registration',
    VERIFY: 'verify-registration'
  },
  LOGIN: {
    PASSWORD: {
      CHECK: 'check-password'
    },
    MAGIC_LOGIN: {
      CHECK: 'check-magic-login',
      CONFIRM: 'confirm-magic-login',
      RETRY: 'retry-magic-login'
    },
    GOOGLE: {},
    GITHUB: {}
  },
  LOGOUT: {}
};
