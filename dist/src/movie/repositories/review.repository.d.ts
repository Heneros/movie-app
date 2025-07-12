import { PrismaService } from '@/prisma/prisma.service';
import { Reviews } from '@prisma/client';
import { CreateMovieReviewDto } from '@/movie/dto-input/create-review.dto';
export declare class ReviewRepository {
    private prisma;
    constructor(prisma: PrismaService);
    findByIdAndAuthor(reviewId: number, auId: number): Promise<Reviews | null>;
    updateReview(reviewId: number, auId: number, data: Partial<Reviews>): Promise<Reviews>;
    findManyReviews(skip: number): Promise<{
        reviews: {
            id: number;
            createdAt: Date;
            movieId: number;
            review: string;
            positive: boolean;
            auId: number;
        }[];
        total: number;
    }>;
    findManyReviewsByMovie(id: number, page: number): Promise<{
        reviews: {
            id: number;
            createdAt: Date;
            movieId: number;
            review: string;
            positive: boolean;
            auId: number;
        }[];
        total: number;
    }>;
    findSingleReviewMovie(id: number): Promise<{
        id: number;
        createdAt: Date;
        movieId: number;
        review: string;
        positive: boolean;
        auId: number;
    }>;
    createReview(movieId: number, auId: number, createMovieReviewDto: CreateMovieReviewDto): Promise<{
        id: number;
        createdAt: Date;
        movieId: number;
        review: string;
        positive: boolean;
        auId: number;
    }>;
    removeReview(reviewId: number, userId: number): Promise<{
        id: number;
        createdAt: Date;
        movieId: number;
        review: string;
        positive: boolean;
        auId: number;
    }>;
}
