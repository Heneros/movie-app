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
exports.RateMovieHandler = void 0;
const cqrs_1 = require("@nestjs/cqrs");
const common_1 = require("@nestjs/common");
const rateMovie_command_1 = require("../commands/rateMovie.command");
const movie_repository_1 = require("../repositories/movie.repository");
const cache_manager_1 = require("@nestjs/cache-manager");
const redis_prefix_enum_1 = require("../../data/redis-prefix-enum");
const ttl_1 = require("../../data/ttl");
let RateMovieHandler = class RateMovieHandler {
    cacheManager;
    movieRepository;
    constructor(cacheManager, movieRepository) {
        this.cacheManager = cacheManager;
        this.movieRepository = movieRepository;
    }
    async execute(command) {
        const { movieId, userId, value } = command;
        const existingRating = await this.movieRepository.findUniqueRating(movieId, userId);
        const cacheKey = `${redis_prefix_enum_1.RedisPrefixEnum.MOVIE}:${movieId}`;
        if (existingRating) {
            await this.movieRepository.updateRating(existingRating.id, value);
            await this.cacheManager.del(cacheKey);
        }
        else {
            await this.movieRepository.createRating(movieId, userId, value);
        }
        const ratings = await this.movieRepository.getAllRatingsForMovie(movieId);
        const total = ratings.reduce((sum, r) => sum + r.value, 0);
        const avg = ratings.length > 0 ? total / ratings.length : 0;
        await this.cacheManager.set(cacheKey, movieId, ttl_1.CACHE_TTL.TWO_HOUR);
        return await this.movieRepository.updateMovie({ id: movieId, avg });
    }
};
exports.RateMovieHandler = RateMovieHandler;
exports.RateMovieHandler = RateMovieHandler = __decorate([
    (0, cqrs_1.CommandHandler)(rateMovie_command_1.RateMovieCommand),
    __param(0, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [Object, movie_repository_1.MovieRepository])
], RateMovieHandler);
//# sourceMappingURL=rateMovie.handler.js.map