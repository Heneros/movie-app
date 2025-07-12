import { GetReviewsByMovieQuery } from '@/movie/queries/reviews/getAllReviewsMovie.query';
import { ReviewRepository } from '@/movie/repositories/review.repository';
import { IQueryHandler } from '@nestjs/cqrs';
export declare class GetAllReviewsByMovieHandler implements IQueryHandler<GetReviewsByMovieQuery> {
    private readonly reviewRepository;
    constructor(reviewRepository: ReviewRepository);
    execute(command: GetReviewsByMovieQuery): Promise<{
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
}
