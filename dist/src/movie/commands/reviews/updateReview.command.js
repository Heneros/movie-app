"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateReviewCommand = void 0;
class UpdateReviewCommand {
    reviewId;
    userId;
    createMovieReviewDto;
    constructor(reviewId, userId, createMovieReviewDto) {
        this.reviewId = reviewId;
        this.userId = userId;
        this.createMovieReviewDto = createMovieReviewDto;
    }
}
exports.UpdateReviewCommand = UpdateReviewCommand;
//# sourceMappingURL=updateReview.command.js.map