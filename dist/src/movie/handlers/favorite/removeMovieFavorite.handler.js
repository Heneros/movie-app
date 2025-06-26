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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoveMovieFavHandler = void 0;
const cqrs_1 = require("@nestjs/cqrs");
const removeMovieFavorite_command_1 = require("../../commands/favorite/removeMovieFavorite.command");
const movie_repository_1 = require("../../repositories/movie.repository");
let RemoveMovieFavHandler = class RemoveMovieFavHandler {
    movieRepository;
    constructor(movieRepository) {
        this.movieRepository = movieRepository;
    }
    async execute(command) {
        const { movieId, userId } = command;
        await this.movieRepository.removeFromFav(movieId, userId);
        console.log('movieId, userId', movieId, userId);
        return { movieId, userId };
    }
};
exports.RemoveMovieFavHandler = RemoveMovieFavHandler;
exports.RemoveMovieFavHandler = RemoveMovieFavHandler = __decorate([
    (0, cqrs_1.CommandHandler)(removeMovieFavorite_command_1.RemoveMovieFavCommand),
    __metadata("design:paramtypes", [movie_repository_1.MovieRepository])
], RemoveMovieFavHandler);
//# sourceMappingURL=removeMovieFavorite.handler.js.map