export const AUTH_CONSTANTS = {
  Strategies: {
    Facebook: {
      clientID: process.env.AUTH_STRATEGY_FACEBOOK_CLIENT_ID || '',
      clientSecret: process.env.AUTH_STRATEGY_FACEBOOK_CLIENT_SECRET || '',
      acceptURL: process.env.AUTH_STRATEGY_FACEBOOK_ACCEPT_URL || 'http://localhost:2180',
      acceptPath: '/api/auth/accept/facebook',
      redirectURL: process.env.AUTH_STRATEGY_FACEBOOK_REDIRECT_URL || 'http://localhost:2080'
    },
    Google: {
      clientID: process.env.AUTH_STRATEGY_GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.AUTH_STRATEGY_GOOGLE_CLIENT_SECRET || '',
      acceptURL: process.env.AUTH_STRATEGY_GOOGLE_ACCEPT_URL || 'http://localhost:2180',
      acceptPath: '/api/auth/accept/google',
      redirectURL: process.env.AUTH_STRATEGY_GOOGLE_REDIRECT_URL || 'http://localhost:2080'
    },
    JWT: {
      secret: process.env.AUTH_STRATEGY_JWT_SECRET || '',
      expiresIn: process.env.AUTH_STRATEGY_JWT_EXPIRES_IN || '10m'
    },
    MagicLogin: {
      secret: process.env.AUTH_STRATEGY_MAGIC_LOGIN_SECRET || '',
      expiresIn: process.env.AUTH_STRATEGY_MAGIC_LOGIN_EXPIRES_IN || '10m',
      baseURL: process.env.AUTH_STRATEGY_MAGIC_LOGIN_BASE_URL || 'http://localhost:2080',
      acceptPath: '/app/accept/magic-login'
    }
  },
  Actions: {
    baseURL: process.env.AUTH_ACTIONS_BASE_URL || 'http://localhost:2080',
    ManageProfile: {
      path: (baseURL: string, token: string): string => {
        const url: URL = new URL(`/app/manage-profile`, baseURL);

        if (token) {
          url.searchParams.set('token', token);
        }

        return url.toString();
      }
    },
    ActivateAccount: {
      path: '/app/activate-account'
    },
    RecoverAccount: {
      path: '/app/reset-password'
    }
  }
};
