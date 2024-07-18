import { Redis as Connection } from 'ioredis';

export type ConnectionFactory = () => Promise<Connection>;
