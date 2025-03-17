import { GetSingleReviewQuery } from '@/movie/queries/reviews/getSingleReview.query';
import { MovieRepository } from '@/movie/repositories/movie.repository';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

@QueryHandler(GetSingleReviewQuery)
export class GetSingleReviewHandler
    implements IQueryHandler<GetSingleReviewQuery>
{
    constructor(private readonly movieRepository: MovieRepository) {}
    async execute(command: GetSingleReviewQuery) {
        const { id } = command;

        const reviews = await this.movieRepository.findSingleReviewMovie(id);
        return reviews;
    }
}
