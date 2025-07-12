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
exports.FilterMoviesHandler = void 0;
const cqrs_1 = require("@nestjs/cqrs");
const commands_1 = require("../commands");
const common_1 = require("@nestjs/common");
const movie_repository_1 = require("../repositories/movie.repository");
const cache_manager_1 = require("@nestjs/cache-manager");
const nest_winston_1 = require("nest-winston");
const redis_prefix_enum_1 = require("../../data/redis-prefix-enum");
const ttl_1 = require("../../data/ttl");
let FilterMoviesHandler = class FilterMoviesHandler {
    logger;
    cacheManager;
    movieRepository;
    constructor(logger, cacheManager, movieRepository) {
        this.logger = logger;
        this.cacheManager = cacheManager;
        this.movieRepository = movieRepository;
    }
    async execute(command) {
        const { filters } = command;
        this.logger.debug('debug', 'Received filters:', filters);
        const nameCache = `${redis_prefix_enum_1.RedisPrefixEnum.MOVIE}:filters:${filters}`;
        const cached = await this.cacheManager.get(nameCache);
        if (cached) {
            this.logger.log('info', `Movies found in cache for key: ${nameCache}`);
            return cached;
        }
        try {
            const result = await this.movieRepository.filterMovie(filters);
            if (!result || result.length === 0) {
                this.logger.warn(`No movies found for filters:`, filters);
                throw new common_1.BadRequestException('No movies found');
            }
            await this.cacheManager.set(nameCache, result, ttl_1.CACHE_TTL.ONE_DAY);
            return result;
        }
        catch (error) {
            this.logger.error('Error filtering movies', error);
            throw error;
        }
    }
};
exports.FilterMoviesHandler = FilterMoviesHandler;
exports.FilterMoviesHandler = FilterMoviesHandler = __decorate([
    (0, cqrs_1.CommandHandler)(commands_1.FilterMoviesCommand),
    __param(0, (0, common_1.Inject)(nest_winston_1.WINSTON_MODULE_NEST_PROVIDER)),
    __param(1, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [Object, Object, movie_repository_1.MovieRepository])
], FilterMoviesHandler);
//# sourceMappingURL=filterMovies.handler.js.map