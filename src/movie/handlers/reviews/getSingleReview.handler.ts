import { GetSingleReviewQuery } from '@/movie/queries/reviews/getSingleReview.query';
import { MovieRepository } from '@/movie/repositories/movie.repository';
import { ReviewRepository } from '@/movie/repositories/review.repository';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

@QueryHandler(GetSingleReviewQuery)
export class GetSingleReviewHandler
    implements IQueryHandler<GetSingleReviewQuery>
{
    constructor(private readonly reviewRepository: ReviewRepository) {}
    async execute(command: GetSingleReviewQuery) {
        const { id } = command;

        const reviews = await this.reviewRepository.findSingleReviewMovie(id);
        return reviews;
    }
}
