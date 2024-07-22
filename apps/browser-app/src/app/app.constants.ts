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
      FACEBOOK: {},
      GOOGLE: {}
    },
    LOGOUT: {},
    REQUEST_ACTIVATION_CODE: {
      CONFIRM: 'activation-code-requested'
    },
    RECOVER_ACCOUNT: {
      CONFIRM: 'account-recovered'
    },
    RESET_PASSWORD: {
      CHECK: 'password-not-reset'
    },
    CONFIRM_EMAIL_ADDRESS_CHANGE: {
      CONFIRM: 'email-address-change-confirmed'
    },
    COMPLETE_EMAIL_ADDRESS_CHANGE: {
      CONFIRM: 'email-address-change-completed'
    },
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
    REQUEST_ACTIVATION_CODE: {
      CHECK: (message: string): string => `Check the username because ${message}.`
    },
    ACTIVATE_ACCOUNT: {
      CHECK: 'Make sure the activation code has not expired. Try requesting a new one.'
    },
    UPDATE_PROFILE: {
      CHECK: 'Check that the user name you are trying to use is available.'
    },
    RECOVER_ACCOUNT: {
      CHECK: 'Try again because there was a problem recovering your account.'
    },
    CONFIRM_EMAIL_ADDRESS_CHANGE: {
      CHECK: 'Try again because there was a problem confirming the email address change'
    },
    COMPLETE_EMAIL_ADDRESS_CHANGE: {
      CHECK: 'Try again because there was a problem completing the email address change'
    },
    CHANGE_PASSWORD: {
      CHECK: 'Make sure that you are providing the old password and a new password.'
    },
    SET_PASSWORD: {
      CHECK: 'Make sure that you are providing a new password.'
    },
    UNSET_PASSWORD: {
      CHECK: 'Make sure that you are providing the old password.'
    },
    CONNECT_ACCOUNT: {
      CHECK: 'Try again because there was a problem connecting your account.'
    },
    DISCONNECT_ACCOUNT: {
      CHECK: 'Try again because there was a problem disconnecting your account.'
    },
    GENERAL: {
      TRY_LATER: 'Try again later because the response from the server was unexpected.'
    }
  }
};
