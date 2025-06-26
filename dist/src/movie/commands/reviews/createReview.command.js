"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateReviewCommand = void 0;
class CreateReviewCommand {
    movieId;
    auId;
    createMovieReviewDto;
    constructor(movieId, auId, createMovieReviewDto) {
        this.movieId = movieId;
        this.auId = auId;
        this.createMovieReviewDto = createMovieReviewDto;
    }
}
exports.CreateReviewCommand = CreateReviewCommand;
//# sourceMappingURL=createReview.command.js.map