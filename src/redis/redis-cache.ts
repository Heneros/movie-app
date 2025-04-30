// import {
//     createClient,
//     createCluster,
//     RedisClientOptions,
//     RedisClientType,
//     RedisClusterOptions,
//     RedisClusterType,
// } from 'redis';
// import '@redis/client';
// import '@redis/bloom';
// import '@redis/graph';
// import '@redis/json';
// import '@redis/search';
// import '@redis/time-series';

// import type { Cache } from 'cache-manager';

// import { RedisStore } from 'cache-manager-redis-store';

// export type Clients = RedisClientType | RedisClusterType;

// export type RedisCache<T extends Clients = RedisClientType> = Cache<
//     RedisStore<T>
// >;

// type Name<T extends Clients> = T extends RedisClientType
//     ? 'redis'
//     : T extends RedisClusterType
//       ? 'redis-cluster'
//       : never;

// export interface RedisStore<T extends Clients = RedisClientType> extends Store {
//     name: Name<T>;
//     isCacheable: (value: unknown) => boolean;
//     get client(): T;
// }
// export class NoCacheableError implements Error {
//     name = 'NoCacheableError';
//     constructor(public message: string) {}
// }
