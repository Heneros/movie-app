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
exports.GetAllReviewsByMovieHandler = void 0;
const getAllReviewsMovie_query_1 = require("../../queries/reviews/getAllReviewsMovie.query");
const review_repository_1 = require("../../repositories/review.repository");
const cqrs_1 = require("@nestjs/cqrs");
let GetAllReviewsByMovieHandler = class GetAllReviewsByMovieHandler {
    reviewRepository;
    constructor(reviewRepository) {
        this.reviewRepository = reviewRepository;
    }
    async execute(command) {
        const { id, page } = command;
        const reviews = await this.reviewRepository.findManyReviewsByMovie(id, page);
        return reviews;
    }
};
exports.GetAllReviewsByMovieHandler = GetAllReviewsByMovieHandler;
exports.GetAllReviewsByMovieHandler = GetAllReviewsByMovieHandler = __decorate([
    (0, cqrs_1.QueryHandler)(getAllReviewsMovie_query_1.GetReviewsByMovieQuery),
    __metadata("design:paramtypes", [review_repository_1.ReviewRepository])
], GetAllReviewsByMovieHandler);
//# sourceMappingURL=getAllReviewsByMovie.handler.js.map