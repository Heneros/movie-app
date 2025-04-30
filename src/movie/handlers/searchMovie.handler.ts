import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { SearchMovieQuery } from '../queries/searchMovie.query';
import { PrismaService } from '@/prisma/prisma.service';
import { BadRequestException, Inject, NotFoundException } from '@nestjs/common';
import { MovieRepository } from '@/movie/repositories/movie.repository';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { CACHE_TTL } from '@/data/ttl';
import { RedisPrefixEnum } from '@/data/redis-prefix-enum';

@QueryHandler(SearchMovieQuery)
export class SearchMovieHandler implements IQueryHandler<SearchMovieQuery> {
    constructor(
        private readonly movieRepository: MovieRepository,
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    ) {}

    async execute(query: SearchMovieQuery) {
        const { searchText, skip } = query;
        const cacheKey = `${RedisPrefixEnum.MOVIE}:search:${searchText}:${skip}`;

        try {
            const cached = await this.cacheManager.get(cacheKey);
            if (cached) {
                return cached;
            }
            const result = await this.movieRepository.searchMovie(
                searchText,
                skip,
            );
            if (!result || result.length === 0) {
                throw new NotFoundException('No matching movies found');
            }

            await this.cacheManager.set(cacheKey, result, CACHE_TTL.ONE_HOUR);

            return result;
        } catch (error) {
            // console.error('Error searching movies:', error);
            throw new BadRequestException('Failed to search movies');
        }
    }
}
