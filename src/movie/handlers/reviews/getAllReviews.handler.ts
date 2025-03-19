import { GetReviewsQuery } from '@/movie/queries/reviews/getAllReviews.query';
import { MovieRepository } from '@/movie/repositories/movie.repository';
import { ReviewRepository } from '@/movie/repositories/review.repository';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

@QueryHandler(GetReviewsQuery)
export class GetAllReviewsHandler implements IQueryHandler<GetReviewsQuery> {
    // private readonly logger = new Logger(MovieGetAllReviewService.name);
    constructor(private readonly reviewRepository: ReviewRepository) {}

    async execute(command: GetReviewsQuery) {
        const { skip } = command;
        const reviews = await this.reviewRepository.findManyReviews(skip);
        return reviews;
    }
}
