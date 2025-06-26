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
exports.RemoveMReviewHandler = void 0;
const removeReview_command_1 = require("../../commands/reviews/removeReview.command");
const review_repository_1 = require("../../repositories/review.repository");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
let RemoveMReviewHandler = class RemoveMReviewHandler {
    eventBus;
    reviewRepository;
    constructor(eventBus, reviewRepository) {
        this.eventBus = eventBus;
        this.reviewRepository = reviewRepository;
    }
    async execute(command) {
        const { reviewId, userId } = command;
        try {
            const review = await this.reviewRepository.findByIdAndAuthor(reviewId, userId);
            if (!review) {
                throw new common_1.NotFoundException('Review not exist');
            }
            const res = await this.reviewRepository.removeReview(reviewId, userId);
            return `Review was deleted ${res.id}`;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
        }
    }
};
exports.RemoveMReviewHandler = RemoveMReviewHandler;
exports.RemoveMReviewHandler = RemoveMReviewHandler = __decorate([
    (0, cqrs_1.CommandHandler)(removeReview_command_1.RemoveReviewCommand),
    __metadata("design:paramtypes", [cqrs_1.EventBus,
        review_repository_1.ReviewRepository])
], RemoveMReviewHandler);
//# sourceMappingURL=removeReview.handler.js.map