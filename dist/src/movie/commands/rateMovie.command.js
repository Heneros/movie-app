"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateMovieCommand = void 0;
class RateMovieCommand {
    movieId;
    userId;
    value;
    constructor(movieId, userId, value) {
        this.movieId = movieId;
        this.userId = userId;
        this.value = value;
    }
}
exports.RateMovieCommand = RateMovieCommand;
//# sourceMappingURL=rateMovie.command.js.map