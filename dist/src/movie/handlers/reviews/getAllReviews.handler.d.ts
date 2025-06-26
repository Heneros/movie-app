import { GetReviewsQuery } from '@/movie/queries/reviews/getAllReviews.query';
import { ReviewRepository } from '@/movie/repositories/review.repository';
import { IQueryHandler } from '@nestjs/cqrs';
export declare class GetAllReviewsHandler implements IQueryHandler<GetReviewsQuery> {
    private readonly reviewRepository;
    constructor(reviewRepository: ReviewRepository);
    execute(command: GetReviewsQuery): Promise<{
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
