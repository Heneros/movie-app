"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisModule = void 0;
const common_1 = require("@nestjs/common");
const redis_service_1 = require("./redis.service");
const config_1 = require("@nestjs/config");
const redis_repository_1 = require("./redis.repository");
const createClient_1 = require("./createClient");
let RedisModule = class RedisModule {
};
exports.RedisModule = RedisModule;
exports.RedisModule = RedisModule = __decorate([
    (0, common_1.Module)({
        imports: [config_1.ConfigModule.forRoot({ isGlobal: true })],
        providers: [
            redis_service_1.RedisService,
            redis_repository_1.RedisRepository,
            {
                provide: 'RedisClient',
                useFactory: (config) => {
                    const redisUrl = config.get('REDIS_URL');
                    const redisToken = config.get('REDIS_TOKEN');
                    if (!redisUrl || !redisToken) {
                        throw new Error('Missing Upstash Redis config');
                    }
                    return (0, createClient_1.createRedisClient)(redisUrl, redisToken);
                },
                inject: [config_1.ConfigService],
            },
        ],
        exports: ['RedisClient', redis_service_1.RedisService, redis_repository_1.RedisRepository],
    })
], RedisModule);
//# sourceMappingURL=redis.module.js.map