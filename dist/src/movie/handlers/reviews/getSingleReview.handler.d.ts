import { GetSingleReviewQuery } from '@/movie/queries/reviews/getSingleReview.query';
import { ReviewRepository } from '@/movie/repositories/review.repository';
import { IQueryHandler } from '@nestjs/cqrs';
export declare class GetSingleReviewHandler implements IQueryHandler<GetSingleReviewQuery> {
    private readonly reviewRepository;
    constructor(reviewRepository: ReviewRepository);
    execute(command: GetSingleReviewQuery): Promise<{
        id: number;
        createdAt: Date;
        movieId: number;
        review: string;
        positive: boolean;
        auId: number;
    }>;
}
