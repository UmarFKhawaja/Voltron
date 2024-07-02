export const constants = {
  ACCESS_TOKEN: 'access-token',
  MESSAGES: {
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
    LOGOUT: {},
    GENERAL: {
      NOT_AUTHENTICATED: 'not-authenticated',
      NOT_AUTHORIZED: 'not-authorized'
    }
  }
};
