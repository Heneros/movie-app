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
exports.CreateMovieHandler = void 0;
const cqrs_1 = require("@nestjs/cqrs");
const createMovie_command_1 = require("../commands/createMovie.command");
const common_1 = require("@nestjs/common");
const movie_repository_1 = require("../repositories/movie.repository");
const cache_manager_1 = require("@nestjs/cache-manager");
const redis_prefix_enum_1 = require("../../data/redis-prefix-enum");
const ttl_1 = require("../../data/ttl");
let CreateMovieHandler = class CreateMovieHandler {
    cacheManager;
    movieRepository;
    constructor(cacheManager, movieRepository) {
        this.cacheManager = cacheManager;
        this.movieRepository = movieRepository;
    }
    async execute(command) {
        const { userId, createMovieDto } = command;
        const movieTitle = await this.movieRepository.findUniqueMovie({
            title: createMovieDto.title,
        });
        if (movieTitle) {
            throw new common_1.BadRequestException('Movie already exists with this title');
        }
        const movie = await this.movieRepository.createMovie(userId, command.createMovieDto);
        const listCacheKey = redis_prefix_enum_1.RedisPrefixEnum.MOVIE_LIST;
        await this.cacheManager.del(listCacheKey);
        const movieCacheKey = `${redis_prefix_enum_1.RedisPrefixEnum.MOVIE}:${movie.id}`;
        await this.cacheManager.set(movieCacheKey, movie, ttl_1.CACHE_TTL.FIVE_MINUTE);
        return movie;
    }
};
exports.CreateMovieHandler = CreateMovieHandler;
exports.CreateMovieHandler = CreateMovieHandler = __decorate([
    (0, cqrs_1.CommandHandler)(createMovie_command_1.CreateMovieCommand),
    __param(0, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [Object, movie_repository_1.MovieRepository])
], CreateMovieHandler);
//# sourceMappingURL=createMovie.handler.js.map