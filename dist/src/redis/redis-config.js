"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisOptions = exports.RedisConfig = void 0;
const config_1 = require("@nestjs/config");
const cache_manager_redis_store_1 = require("cache-manager-redis-store");
exports.RedisConfig = (0, config_1.registerAs)('redis', () => ({
    host: process.env.REDIS_HOST || 'redis',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    username: process.env.REDIS_USERNAME || 'default',
    password: process.env.REDIS_PASSWORD || '',
    ttl: parseInt(process.env.REDIS_TTL || '60000', 10),
}));
exports.RedisOptions = {
    isGlobal: true,
    inject: [config_1.ConfigService],
    imports: [config_1.ConfigModule],
    useFactory: async (configService) => {
        const config = configService.get('redis');
        return {
            store: await (0, cache_manager_redis_store_1.redisStore)({
                username: config.username,
                password: config.password,
                socket: {
                    host: config.host,
                    port: config.port,
                },
            }),
            ttl: config.ttl,
        };
    },
};
//# sourceMappingURL=redis-config.js.map