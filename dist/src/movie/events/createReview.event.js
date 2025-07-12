"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatedReviewEvent = void 0;
class CreatedReviewEvent {
    movieId;
    auId;
    createMovieReviewDto;
    constructor(movieId, auId, createMovieReviewDto) {
        this.movieId = movieId;
        this.auId = auId;
        this.createMovieReviewDto = createMovieReviewDto;
    }
}
exports.CreatedReviewEvent = CreatedReviewEvent;
//# sourceMappingURL=createReview.event.js.map