import { GetReviewsQuery } from '@/movie/queries/reviews/getAllReviews.query';
import { MovieRepository } from '@/movie/repositories/movie.repository';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

@QueryHandler(GetReviewsQuery)
export class GetAllReviewsHandler implements IQueryHandler<GetReviewsQuery> {
    // private readonly logger = new Logger(MovieGetAllReviewService.name);
    constructor(private readonly movieRepository: MovieRepository) {}

    async execute(command: GetReviewsQuery) {
        const { skip } = command;
        const reviews = await this.movieRepository.findManyReviews(skip);
        return reviews;
    }
}
