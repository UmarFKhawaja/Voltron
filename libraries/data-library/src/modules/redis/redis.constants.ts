export const REDIS_CONSTANTS = {
  Symbols: {
    Factories: {
      ConnectionFactory: 'REDIS_CONNECTION_FACTORY'
    },
    Services: {
      MailService: 'REDIS_MAIL_SERVICE',
      MessageService: 'REDIS_MESSAGE_SERVICE',
      SessionService: 'REDIS_SESSION_SERVICE'
    }
  },
  Settings: {
    host: process.env['REDIS_HOST'] || 'localhost',
    port: parseInt(process.env['REDIS_PORT'] || '6379') || 6379,
    username: process.env['REDIS_USERNAME'] || '',
    password: process.env['REDIS_PASSWORD'] || ''
  },
  Names: {
    Notifications: 'NOTIFICATIONS'
  }
};
