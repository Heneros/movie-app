import { PAGINATION_LIMIT } from '@/data/defaultData';
import { PrismaService } from '@/prisma/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Reviews } from '@prisma/client';
import { CreateMovieReviewDto } from '@/movie/dto-input/create-review.dto';

@Injectable()
export class ReviewRepository {
    constructor(private prisma: PrismaService) {}

    async findByIdAndAuthor(
        reviewId: number,
        auId: number,
    ): Promise<Reviews | null> {
        return this.prisma.reviews.findFirst({
            where: { id: reviewId, auId: auId },
        });
    }

    async updateReview(
        reviewId: number,
        auId: number,
        data: Partial<Reviews>,
    ): Promise<Reviews> {
        return this.prisma.reviews.update({
            where: { id: reviewId, auId: auId },
            data,
        });
    }

    async findManyReviews(skip: number) {
        // console.log(12345);
        const [reviews, total] = await Promise.all([
            this.prisma.reviews.findMany({
                skip,
                take: PAGINATION_LIMIT,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.reviews.count(),
        ]);

        return { reviews, total };
    }

    async findManyReviewsByMovie(id: number, page: number) {
        const pageSize = PAGINATION_LIMIT;
        const skip = (page - 1) * pageSize;

        const reviews = await this.prisma.reviews.findMany({
            skip,
            take: PAGINATION_LIMIT,
            orderBy: { createdAt: 'desc' },
            where: {
                movieId: id,
            },
        });
        const total = await this.prisma.reviews.count();

        if (!reviews) {
            throw new NotFoundException('No reviews created yet.');
        }

        return { reviews, total };
    }

    async findSingleReviewMovie(id: number) {
        const review = await this.prisma.reviews.findUnique({
            where: {
                id,
            },
        });

        if (!review) {
            throw new NotFoundException('No review(s) created yet.');
        }

        return review;
    }

    async createReview(
        movieId: number,
        auId: number,
        createMovieReviewDto: CreateMovieReviewDto,
    ) {
        return await this.prisma.reviews.create({
            data: {
                review: createMovieReviewDto.review,
                positive: createMovieReviewDto.positive,
                movieId: movieId,
                auId: auId,
            },
        });
    }

    async removeReview(reviewId: number, userId: number) {
        const review = await this.prisma.reviews.delete({
            where: {
                id: reviewId,
                auId: userId,
            },
        });
        return review;
    }
}
