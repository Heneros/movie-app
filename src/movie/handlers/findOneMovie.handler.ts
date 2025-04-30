import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindOneMovieQuery } from '../queries/findOneMovie.query';
import { MovieRepository } from '@/movie/repositories/movie.repository';
import { BadRequestException, Inject } from '@nestjs/common';
import { RedisPrefixEnum } from '@/data/redis-prefix-enum';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Movie } from '@prisma/client';
import { CACHE_TTL } from '@/data/ttl';

@QueryHandler(FindOneMovieQuery)
export class FindOneHandler implements IQueryHandler<FindOneMovieQuery> {
    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        private readonly movieRepository: MovieRepository,
    ) {}

    async execute(query: FindOneMovieQuery) {
        const { id } = query;
        try {
            const redisKeyMovie = `${RedisPrefixEnum.MOVIE}:${id}`;
            const cachedData =
                await this.cacheManager.get<Movie>(redisKeyMovie);

            const movieId = await this.movieRepository.findUniqueMovie({
                id,
            });
            if (!movieId) {
                throw new BadRequestException('Movie dont exist');
            }

            if (cachedData) {
                return cachedData;
            }

            await this.cacheManager.set(
                redisKeyMovie,
                movieId,
                CACHE_TTL.ONE_HOUR,
            );
            return movieId;
        } catch (error) {
            // console.error('Error finding movie:', error);
            throw new BadRequestException('Invalid data format', error);
        }
    }
}
