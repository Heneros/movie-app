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
exports.ReviewRepository = void 0;
const defaultData_1 = require("../../data/defaultData");
const prisma_service_1 = require("../../prisma/prisma.service");
const common_1 = require("@nestjs/common");
let ReviewRepository = class ReviewRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findByIdAndAuthor(reviewId, auId) {
        return this.prisma.reviews.findFirst({
            where: { id: reviewId, auId: auId },
        });
    }
    async updateReview(reviewId, auId, data) {
        return this.prisma.reviews.update({
            where: { id: reviewId, auId: auId },
            data,
        });
    }
    async findManyReviews(skip) {
        const [reviews, total] = await Promise.all([
            this.prisma.reviews.findMany({
                skip,
                take: defaultData_1.PAGINATION_LIMIT,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.reviews.count(),
        ]);
        return { reviews, total };
    }
    async findManyReviewsByMovie(id, page) {
        const pageSize = defaultData_1.PAGINATION_LIMIT;
        const skip = (page - 1) * pageSize;
        const reviews = await this.prisma.reviews.findMany({
            skip,
            take: defaultData_1.PAGINATION_LIMIT,
            orderBy: { createdAt: 'desc' },
            where: {
                movieId: id,
            },
        });
        const total = await this.prisma.reviews.count();
        if (!reviews) {
            throw new common_1.NotFoundException('No reviews created yet.');
        }
        return { reviews, total };
    }
    async findSingleReviewMovie(id) {
        const review = await this.prisma.reviews.findUnique({
            where: {
                id,
            },
        });
        if (!review) {
            throw new common_1.NotFoundException('No review(s) created yet.');
        }
        return review;
    }
    async createReview(movieId, auId, createMovieReviewDto) {
        return await this.prisma.reviews.create({
            data: {
                review: createMovieReviewDto.review,
                positive: createMovieReviewDto.positive,
                movieId: movieId,
                auId: auId,
            },
        });
    }
    async removeReview(reviewId, userId) {
        const review = await this.prisma.reviews.delete({
            where: {
                id: reviewId,
                auId: userId,
            },
        });
        return review;
    }
};
exports.ReviewRepository = ReviewRepository;
exports.ReviewRepository = ReviewRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReviewRepository);
//# sourceMappingURL=review.repository.js.map