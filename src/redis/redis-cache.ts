import {
    createClient,
    createCluster,
    RedisClientOptions,
    RedisClientType,
    RedisClusterOptions,
    RedisClusterType,
} from 'redis';
import '@redis/client';
import '@redis/bloom';
import '@redis/graph';
import '@redis/json';
import '@redis/search';
import '@redis/time-series';

import type { Cache } from 'cache-manager';


export type Clients = RedisClientType | RedisClusterType

// export