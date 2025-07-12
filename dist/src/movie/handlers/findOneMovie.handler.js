"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindOneHandler = void 0;
const cqrs_1 = require("@nestjs/cqrs");
const findOneMovie_query_1 = require("../queries/findOneMovie.query");
const movie_repository_1 = require("../repositories/movie.repository");
const common_1 = require("@nestjs/common");
const redis_prefix_enum_1 = require("../../data/redis-prefix-enum");
const cache_manager_1 = require("@nestjs/cache-manager");
const ttl_1 = require("../../data/ttl");
const nest_winston_1 = require("nest-winston");
let FindOneHandler = class FindOneHandler {
    logger;
    cacheManager;
    movieRepository;
    constructor(logger, cacheManager, movieRepository) {
        this.logger = logger;
        this.cacheManager = cacheManager;
        this.movieRepository = movieRepository;
    }
    async execute(query) {
        const { id } = query;
        try {
            const redisKeyMovie = `${redis_prefix_enum_1.RedisPrefixEnum.MOVIE}:${id}`;
            const cachedData = await this.cacheManager.get(redisKeyMovie);
            const movieId = await this.movieRepository.findUniqueMovie({
                id,
            });
            this.logger.debug(`Movie exist ${movieId} `);
            if (!movieId) {
                throw new common_1.BadRequestException(`Movie dont exist', ${id}`);
            }
            if (cachedData) {
                return cachedData;
            }
            await this.cacheManager.set(redisKeyMovie, movieId, ttl_1.CACHE_TTL.ONE_HOUR);
            return movieId;
        }
        catch (error) {
            throw new common_1.BadRequestException('Invalid data format', error);
        }
    }
};
exports.FindOneHandler = FindOneHandler;
exports.FindOneHandler = FindOneHandler = __decorate([
    (0, cqrs_1.QueryHandler)(findOneMovie_query_1.FindOneMovieQuery),
    __param(0, (0, common_1.Inject)(nest_winston_1.WINSTON_MODULE_NEST_PROVIDER)),
    __param(1, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [Object, Object, movie_repository_1.MovieRepository])
], FindOneHandler);
//# sourceMappingURL=findOneMovie.handler.js.map