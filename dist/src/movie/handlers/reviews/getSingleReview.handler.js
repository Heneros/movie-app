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
exports.GetSingleReviewHandler = void 0;
const getSingleReview_query_1 = require("../../queries/reviews/getSingleReview.query");
const review_repository_1 = require("../../repositories/review.repository");
const cqrs_1 = require("@nestjs/cqrs");
let GetSingleReviewHandler = class GetSingleReviewHandler {
    reviewRepository;
    constructor(reviewRepository) {
        this.reviewRepository = reviewRepository;
    }
    async execute(command) {
        const { id } = command;
        const reviews = await this.reviewRepository.findSingleReviewMovie(id);
        return reviews;
    }
};
exports.GetSingleReviewHandler = GetSingleReviewHandler;
exports.GetSingleReviewHandler = GetSingleReviewHandler = __decorate([
    (0, cqrs_1.QueryHandler)(getSingleReview_query_1.GetSingleReviewQuery),
    __metadata("design:paramtypes", [review_repository_1.ReviewRepository])
], GetSingleReviewHandler);
//# sourceMappingURL=getSingleReview.handler.js.map