export const ACCESS_TOKEN: string = 'access-token';

export const MESSAGES = {
  REGISTER: {
    CHECK_REGISTRATION: 'check-registration',
    VERIFY_REGISTRATION: 'verify-registration'
  },
  LOGIN: {
    PASSWORD: {
      CHECK_AUTHENTICATION: 'check-authentication'
    },
    MAGIC_LOGIN: {
      CHECK_AUTHENTICATION: 'check-authentication',
      CONFIRM_AUTHENTICATION: 'confirm-authentication',
      RETRY_AUTHENTICATION: 'retry-authentication'
    },
    GOOGLE: {},
    GITHUB: {}
  },
  LOGOUT: {}
};
