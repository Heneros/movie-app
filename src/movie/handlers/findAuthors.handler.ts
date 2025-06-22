import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindDraftsMovieQuery } from '../queries/findDrafts.query';
import { MovieRepository } from '@/movie/repositories/movie.repository';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject } from '@nestjs/common';
import { Movie } from '@prisma/client';
import { RedisPrefixEnum } from '@/data/redis-prefix-enum';
import { CACHE_TTL } from '@/data/ttl';
import { FindAuthorMovieQuery } from '../queries/findAuthorMovie.query';

@QueryHandler(FindAuthorMovieQuery)
export class FindAuthorHandler implements IQueryHandler<FindAuthorMovieQuery> {
    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        private readonly movieRepository: MovieRepository,
    ) {}

    async execute(query: FindAuthorMovieQuery) {
        const { id } = query;

        const cacheKey = `${RedisPrefixEnum.MOVIE_LIST}:author:${id}`;
        const moviesCache = await this.cacheManager.get<Movie[]>(cacheKey);

        // console.log('test');
        if (moviesCache) {
         //   console.log('moviesCache 444', moviesCache);
            return moviesCache;
        }

        const result = await this.movieRepository.findAuthorMovie(id);
        await this.cacheManager.set(cacheKey, result, CACHE_TTL.ONE_HOUR);

        return result;
    }
}
