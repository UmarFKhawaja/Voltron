import { GRPC as GRPCConnection } from '@cerbos/grpc';
import { HTTP as HTTPConnection } from '@cerbos/http';
import { CerbosAccessService } from './cerbos-access.service';
import { CERBOS_CONSTANTS } from './cerbos.constants';
import { GRPCConnectionFactory, HTTPConnectionFactory } from './cerbos.types';

export const cerbosProviders = [
  {
    provide: CERBOS_CONSTANTS.Symbols.Factories.GRPCConnectionFactory,
    useFactory: (): GRPCConnectionFactory => async (): Promise<GRPCConnection> => new GRPCConnection(`${CERBOS_CONSTANTS.Settings.host}:${CERBOS_CONSTANTS.Settings.ports.grpc}`, {
      tls: false
    })
  },
  {
    provide: CERBOS_CONSTANTS.Symbols.Factories.HTTPConnectionFactory,
    useFactory: (): HTTPConnectionFactory => async (): Promise<HTTPConnection> => new HTTPConnection(`${CERBOS_CONSTANTS.Settings.host}:${CERBOS_CONSTANTS.Settings.ports.http}`, {
    })
  },
  {
    provide: CERBOS_CONSTANTS.Symbols.Services.AccessService,
    useFactory: async (makeGPRCConnection: GRPCConnectionFactory): Promise<CerbosAccessService> => {
      const connection: GRPCConnection = await makeGPRCConnection();

      return new CerbosAccessService(connection);
    },
    inject: [CERBOS_CONSTANTS.Symbols.Factories.GRPCConnectionFactory]
  }
];
