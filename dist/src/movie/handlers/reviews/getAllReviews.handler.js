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
exports.GetAllReviewsHandler = void 0;
const getAllReviews_query_1 = require("../../queries/reviews/getAllReviews.query");
const review_repository_1 = require("../../repositories/review.repository");
const cqrs_1 = require("@nestjs/cqrs");
let GetAllReviewsHandler = class GetAllReviewsHandler {
    reviewRepository;
    constructor(reviewRepository) {
        this.reviewRepository = reviewRepository;
    }
    async execute(command) {
        const { skip } = command;
        const reviews = await this.reviewRepository.findManyReviews(skip);
        return reviews;
    }
};
exports.GetAllReviewsHandler = GetAllReviewsHandler;
exports.GetAllReviewsHandler = GetAllReviewsHandler = __decorate([
    (0, cqrs_1.QueryHandler)(getAllReviews_query_1.GetReviewsQuery),
    __metadata("design:paramtypes", [review_repository_1.ReviewRepository])
], GetAllReviewsHandler);
//# sourceMappingURL=getAllReviews.handler.js.map