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
exports.UpdateReviewHandler = void 0;
const updateReview_command_1 = require("../../commands/reviews/updateReview.command");
const review_repository_1 = require("../../repositories/review.repository");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const date_fns_1 = require("date-fns");
let UpdateReviewHandler = class UpdateReviewHandler {
    reviewRepository;
    constructor(reviewRepository) {
        this.reviewRepository = reviewRepository;
    }
    async execute(command) {
        const { reviewId, userId, createMovieReviewDto } = command;
        const review = await this.reviewRepository.findByIdAndAuthor(reviewId, userId);
        if (!review) {
            throw new common_1.BadRequestException('Review does not exist');
        }
        const now = new Date();
        const reviewCreatedAt = new Date(review.createdAt);
        const minutesPassed = (0, date_fns_1.differenceInMinutes)(now, reviewCreatedAt);
        if (minutesPassed > 15) {
            throw new common_1.BadRequestException('You can only edit the review within 15 minutes of creation.');
        }
        return await this.reviewRepository.updateReview(reviewId, userId, {
            review: createMovieReviewDto.review,
            positive: createMovieReviewDto.positive,
        });
    }
};
exports.UpdateReviewHandler = UpdateReviewHandler;
exports.UpdateReviewHandler = UpdateReviewHandler = __decorate([
    (0, cqrs_1.CommandHandler)(updateReview_command_1.UpdateReviewCommand),
    __metadata("design:paramtypes", [review_repository_1.ReviewRepository])
], UpdateReviewHandler);
//# sourceMappingURL=updateReview.handler.js.map