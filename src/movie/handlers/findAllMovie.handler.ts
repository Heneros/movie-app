import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindAllMovieQuery } from '../queries/findAllMovie.query';
import { Inject, NotFoundException } from '@nestjs/common';
import { performance } from 'perf_hooks';

import { MovieRepository } from './../repositories/movie.repository';

import { RedisService } from '@/redis/redis.service';

@QueryHandler(FindAllMovieQuery)
export class FindAllMovieHandler implements IQueryHandler<FindAllMovieQuery> {
    constructor(
        private readonly movieRepository: MovieRepository,
        @Inject(RedisService) private readonly redisService: RedisService,
    ) {}

    async execute(query: FindAllMovieQuery) {
        const { skip } = query;

        //   const start = performance.now();
        const movieCached = await this.redisService.getMovies(String(skip));
        // console.log('test555');
        if (movieCached) {
            ///  console.log('test555');
            //  const parsed = JSON.parse(cached as string) as Movie[];
            // console.log(
            //     'Cache Hit35:',
            //     (performance.now() - start).toFixed(2),
            //     'ms',
            // );

            const parsed = JSON.parse(movieCached);
            return parsed;
        }

        const allMovies = await this.movieRepository.findAllMovie(skip);

        if (allMovies.length === 0) {
            throw new NotFoundException('No movies Exist');
        }

        await this.redisService.saveMovies(
            // RedisPrefixEnum.MOVIE_LIST,
            //    skip as number,
            String(skip),
            allMovies,
        );
        // console.log('not from redis');
        // console.log('Saving to Redis:', allMovies.length, 'movies');
        // console.log('Cache Miss:', Date.now() - start, 'ms');
        return allMovies;
    }
}
