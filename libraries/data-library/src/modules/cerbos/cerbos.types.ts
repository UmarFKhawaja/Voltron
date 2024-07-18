import { GRPC as GRPCConnection } from '@cerbos/grpc';
import { HTTP as HTTPConnection } from '@cerbos/http';

export type GRPCConnectionFactory = () => Promise<GRPCConnection>;

export type HTTPConnectionFactory = () => Promise<HTTPConnection>;
