import { GRPC as Connector } from '@cerbos/grpc';
import { CerbosAccessService } from './cerbos-access.service';
import { CERBOS_CONSTANTS } from './cerbos.constants';
import { ConnectorFactory } from './cerbos.types';

export const cerbosProviders = [
  {
    provide: CERBOS_CONSTANTS.Symbols.Factories.ConnectorFactory,
    useFactory: () => new Connector('', {
      tls: false
    })
  },
  {
    provide: CERBOS_CONSTANTS.Symbols.Services.AccessService,
    useFactory: (makeConnector: ConnectorFactory) => new CerbosAccessService(makeConnector),
    inject: [CERBOS_CONSTANTS.Symbols.Factories.ConnectorFactory]
  }
];
