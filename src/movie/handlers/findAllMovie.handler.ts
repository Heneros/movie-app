import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindAllMovieQuery } from '../queries/findAllMovie.query';
import { Inject, NotFoundException } from '@nestjs/common';
import { performance } from 'perf_hooks';

import { MovieRepository } from './../repositories/movie.repository';
import { Movie } from '@prisma/client';
import { CACHE_TTL } from '@/data/ttl';
import { RedisPrefixEnum } from '@/data/redis-prefix-enum';
import { RedisService } from '@/redis/redis.service';

@QueryHandler(FindAllMovieQuery)
export class FindAllMovieHandler implements IQueryHandler<FindAllMovieQuery> {
    constructor(
        private readonly movieRepository: MovieRepository,
        private readonly redisService: RedisService,
    ) {}

    async execute(query: FindAllMovieQuery) {
        const { skip } = query;
        const cacheKey = `${RedisPrefixEnum.MOVIE}:${skip}`;
        const redis = this.redisService.getClient();

        const cached = await redis.get(cacheKey);
        const start = performance.now();

        if (cached) {
            const parsed = JSON.parse(cached as string) as Movie[];
            console.log(
                'Cache Hit:',
                (performance.now() - start).toFixed(2),
                'ms',
            );
            return { allMovies: parsed };
        }

        const allMovies = await this.movieRepository.findAllMovie(skip);

        if (allMovies.length === 0) {
            throw new NotFoundException('No movies Exist');
        }

        await redis.set(cacheKey, JSON.stringify(allMovies), {
            EX: CACHE_TTL.ONE_HOUR,
        });

        console.log('Cache Miss:', Date.now() - start, 'ms');
        return { allMovies };
    }
}
