import { GetReviewsByMovieQuery } from '@/movie/queries/reviews/getAllReviewsMovie.query';
import { MovieRepository } from '@/movie/repositories/movie.repository';
import { ReviewRepository } from '@/movie/repositories/review.repository';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

@QueryHandler(GetReviewsByMovieQuery)
export class GetAllReviewsByMovieHandler
    implements IQueryHandler<GetReviewsByMovieQuery>
{
    // private readonly logger = new Logger(MovieGetAllReviewService.name);
    constructor(private readonly reviewRepository: ReviewRepository) {}

    async execute(command: GetReviewsByMovieQuery) {
        const { id, page } = command;

        const reviews = await this.reviewRepository.findManyReviewsByMovie(
            id,
            page,
        );
        return reviews;
    }
}
