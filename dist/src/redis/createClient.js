"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRedisClient = void 0;
const redis_1 = require("@upstash/redis");
const createRedisClient = (restUrl, restToken) => {
    const redis = new redis_1.Redis({
        url: restUrl,
        token: restToken,
    });
    return redis;
};
exports.createRedisClient = createRedisClient;
//# sourceMappingURL=createClient.js.map