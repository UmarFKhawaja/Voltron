export const constants = {
  TOKEN: 'token',
  CODES: {
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
    CHANGE_PASSWORD: {
      CONFIRM: 'password-changed'
    },
    SET_PASSWORD: {
      CONFIRM: 'password-set'
    },
    UNSET_PASSWORD: {
      CONFIRM: 'password-unset'
    },
    GENERAL: {
      NOT_AUTHENTICATED: 'not-authenticated',
      NOT_AUTHORIZED: 'not-authorized'
    }
  },
  MESSAGES: {
    UPDATE_PROFILE: {
      CHECK: 'Check that the user name you are trying to use is available.'
    },
    CHANGE_PASSWORD: {
      CHECK: 'Make sure that you are providing the old password and a new password.'
    },
    SET_PASSWORD: {
      CHECK: 'Make sure that you are providing a new password.'
    },
    UNSET_PASSWORD: {
      CHECK: 'Make sure that you are providing the old password.'
    }
  }
};
