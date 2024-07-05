export const JWT_CONSTANTS = {
  secret: process.env.JWT_SECRET || '',
  expiresIn: process.env.JWT_EXPIRES_IN || '10m'
};

export const MAGIC_LOGIN_CONSTANTS = {
  secret: process.env.MAGIC_LOGIN_SECRET || '',
  expiresIn: process.env.MAGIC_LOGIN_EXPIRES_IN || '10m',
  baseURL: process.env.MAGIC_LOGIN_BASE_URL || 'http://localhost:2080',
  acceptPath: '/app/accept/magic-login'
};

export const GITHUB_CONSTANTS = {
  clientID: process.env.GITHUB_CLIENT_ID || '',
  clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
  acceptURL: process.env.GITHUB_ACCEPT_URL || 'http://localhost:2180',
  acceptPath: '/api/auth/accept/github',
  redirectURL: process.env.GITHUB_REDIRECT_URL || 'http://localhost:2080'
};

export const GOOGLE_CONSTANTS = {
  clientID: process.env.GOOGLE_CLIENT_ID || '',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  acceptURL: process.env.GOOGLE_ACCEPT_URL || 'http://localhost:2180',
  acceptPath: '/api/auth/accept/google',
  redirectURL: process.env.GOOGLE_REDIRECT_URL || 'http://localhost:2080'
};
