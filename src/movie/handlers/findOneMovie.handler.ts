import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindOneMovieQuery } from '../queries/findOneMovie.query';

import { MovieRepository } from '@/movie/repositories/movie.repository';
import { BadRequestException } from '@nestjs/common';

@QueryHandler(FindOneMovieQuery)
export class FindOneHandler implements IQueryHandler<FindOneMovieQuery> {
    constructor(private readonly movieRepository: MovieRepository) {}

    async execute(query: FindOneMovieQuery) {
        const { id } = query;
        // console.log('movieId, user ', id);
        try {
            const movieId = await this.movieRepository.findUniqueMovie({
                id: id,
            });
            if (!movieId) {
                throw new BadRequestException('Movie dont exist');
            }

            return movieId;
        } catch (error) {
            console.error('Error finding movie:', error);
            return null;
        }
    }
}
