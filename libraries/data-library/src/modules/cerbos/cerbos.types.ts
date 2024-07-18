import { GRPC as Connector } from '@cerbos/grpc';

export type ConnectorFactory = () => Connector;
