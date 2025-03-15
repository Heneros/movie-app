import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindOneMovieQuery } from '../queries/findOneMovie.query';

import { MovieRepository } from '@/movie/repositories/movie.repository';

@QueryHandler(FindOneMovieQuery)
export class FindOneHandler implements IQueryHandler<FindOneMovieQuery> {
    constructor(private readonly movieRepository: MovieRepository) {}

    async execute(query: FindOneMovieQuery) {
        const { id } = query;
        // console.log('movieId, user ', id);
        try {
            return await this.movieRepository.findUniqueMovie({
                id,
            });
        } catch (error) {
            console.error('Error finding movie:', error);
            return null;
        }
    }
}
