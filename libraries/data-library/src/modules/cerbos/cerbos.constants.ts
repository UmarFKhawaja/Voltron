export const CERBOS_CONSTANTS = {
  Symbols: {
    Factories: {
      GRPCConnectionFactory: 'CERBOS_GRPC_CONNECTION_FACTORY',
      HTTPConnectionFactory: 'CERBOS_HTTP_CONNECTION_FACTORY'
    },
    Services: {
      AccessService: 'CERBOS_ACCESS_SERVICE'
    }
  },
  Settings: {
    host: process.env['CERBOS_HOST'] || '',
    ports: {
      http: parseInt(process.env['CERBOS_HTTP_PORT'] || '3592'),
      grpc: parseInt(process.env['CERBOS_GRPC_PORT'] || '3593')
    }
  }
};
