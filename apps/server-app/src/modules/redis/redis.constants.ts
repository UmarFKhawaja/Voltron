export const REDIS_CONSTANTS = {
  Symbols: {
    Connection: 'REDIS_CONNECTION',
    Services: {
      SessionService: 'REDIS_SESSION_SERVICE'
    }
  },
  Settings: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379') || 6379,
    username: process.env.REDIS_USERNAME || '',
    password: process.env.REDIS_PASSWORD || ''
  }
};
