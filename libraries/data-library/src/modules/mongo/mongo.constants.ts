export const MONGO_CONSTANTS = {
  Symbols: {
    Factories: {
      ConnectionFactory: 'MONGO_CONNECTION_FACTORY',
      ModelsFactory: 'MONGO_MODELS_FACTORY'
    },
    Services: {
      UserService: 'MONGO_USER_SERVICE',
      AccountService: 'MONGO_ACCOUNT_SERVICE',
      VerificationRequestService: 'MONGO_VERIFICATION_REQUEST_SERVICE',
    }
  },
  Settings: {
    host: process.env['MONGO_HOST'] || 'localhost',
    port: parseInt(process.env['MONGO_PORT'] || '27017') || 27017,
    username: process.env['MONGO_USERNAME'] || '',
    password: process.env['MONGO_PASSWORD'] || '',
    database: process.env['MONGO_DATABASE'] || 'voltron',
    connectionString: process.env['MONGO_CONNECTION_STRING'] || ''
  }
};
