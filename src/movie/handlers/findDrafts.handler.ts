import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindDraftsMovieQuery } from '../queries/findDrafts.query';
import { MovieRepository } from '@/movie/repositories/movie.repository';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject } from '@nestjs/common';
import { Movie } from '@prisma/client';
import { RedisPrefixEnum } from '@/data/redis-prefix-enum';
import { CACHE_TTL } from '@/data/ttl';

@QueryHandler(FindDraftsMovieQuery)
export class FindDraftsHandler implements IQueryHandler<FindDraftsMovieQuery> {
    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        private readonly movieRepository: MovieRepository,
    ) {}

    async execute(query: FindDraftsMovieQuery) {
        const { skip } = query;

        const cacheKey = `${RedisPrefixEnum.MOVIE}:${skip}`;
        const moviesCache = await this.cacheManager.get<Movie[]>(cacheKey);

        if (moviesCache) {
            console.log('moviesCache', moviesCache);
            return moviesCache;
        }

        const result = await this.movieRepository.findAllDraftsMovie(skip);
        await this.cacheManager.set(cacheKey, result, CACHE_TTL.ONE_HOUR);

        return result;
    }
}
