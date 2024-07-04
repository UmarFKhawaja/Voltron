import Redis from 'ioredis';

export type ConnectionFactory = () => Promise<Redis>;
