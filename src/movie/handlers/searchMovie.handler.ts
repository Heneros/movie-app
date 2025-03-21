import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { SearchMovieQuery } from '../queries/searchMovie.query';
import { PrismaService } from '@/prisma/prisma.service';
import { BadRequestException } from '@nestjs/common';
import { MovieRepository } from '@/movie/repositories/movie.repository';

@QueryHandler(SearchMovieQuery)
export class SearchMovieHandler implements IQueryHandler<SearchMovieQuery> {
    constructor(
        private readonly movieRepository: MovieRepository,
        private readonly prisma: PrismaService,
    ) {}

    async execute(query: SearchMovieQuery) {
        const { searchText, skip } = query;

        try {
            return await this.movieRepository.searchMovie(searchText, skip);
        } catch (error) {
            console.error('Error searching movies:', error);
            throw new BadRequestException('Failed to search movies');
        }
    }
}
