import { GetReviewsByMovieQuery } from '@/movie/queries/reviews/getAllReviewsMovie.query';
import { MovieRepository } from '@/movie/repositories/movie.repository';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

@QueryHandler(GetReviewsByMovieQuery)
export class GetAllReviewsByMovieHandler
    implements IQueryHandler<GetReviewsByMovieQuery>
{
    // private readonly logger = new Logger(MovieGetAllReviewService.name);
    constructor(private readonly movieRepository: MovieRepository) {}

    async execute(command: GetReviewsByMovieQuery) {
        const { id, page } = command;


        const reviews = await this.movieRepository.findManyReviewsByMovie(
            id,
            page,
        );
        return reviews;
    }
}
