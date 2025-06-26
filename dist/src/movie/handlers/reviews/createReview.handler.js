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
exports.CreateMovieReviewHandler = void 0;
const createReview_command_1 = require("../../commands/reviews/createReview.command");
const createReview_event_1 = require("../../events/createReview.event");
const review_repository_1 = require("../../repositories/review.repository");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
let CreateMovieReviewHandler = class CreateMovieReviewHandler {
    eventBus;
    reviewRepository;
    constructor(eventBus, reviewRepository) {
        this.eventBus = eventBus;
        this.reviewRepository = reviewRepository;
    }
    async execute(command) {
        const { movieId, auId, createMovieReviewDto } = command;
        const review = await this.reviewRepository.findByIdAndAuthor(movieId, auId);
        if (review) {
            throw new common_1.BadRequestException('You already reviewed this movie.');
        }
        const newReview = await this.reviewRepository.createReview(movieId, auId, createMovieReviewDto);
        this.eventBus.publish(new createReview_event_1.CreatedReviewEvent(movieId, auId, createMovieReviewDto));
        return newReview;
    }
};
exports.CreateMovieReviewHandler = CreateMovieReviewHandler;
exports.CreateMovieReviewHandler = CreateMovieReviewHandler = __decorate([
    (0, cqrs_1.CommandHandler)(createReview_command_1.CreateReviewCommand),
    __metadata("design:paramtypes", [cqrs_1.EventBus,
        review_repository_1.ReviewRepository])
], CreateMovieReviewHandler);
//# sourceMappingURL=createReview.handler.js.map