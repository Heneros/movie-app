import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindOneMovieQuery } from '../queries/findOneMovie.query';
import { MovieRepository } from '@/movie/repositories/movie.repository';
import { BadRequestException, Inject, LoggerService } from '@nestjs/common';
import { RedisPrefixEnum } from '@/data/redis-prefix-enum';
import { Cache } from 'cache-manager';

import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Movie } from '@prisma/client';
import { CACHE_TTL } from '@/data/ttl';
import {
    WINSTON_MODULE_NEST_PROVIDER,
    WINSTON_MODULE_PROVIDER,
} from 'nest-winston';

@QueryHandler(FindOneMovieQuery)
export class FindOneHandler implements IQueryHandler<FindOneMovieQuery> {
    ///   protected readonly logger: Logger;

    constructor(
        //   @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
        // @Inject('winston') private readonly logger: Logger,
        @Inject(WINSTON_MODULE_NEST_PROVIDER)
        private readonly logger: LoggerService,
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

            this.logger.warn(`Movie exist ${movieId} `);

            this.logger.debug(`Movie exist ${movieId} `);
            if (!movieId) {
                this.logger.error(`Movie dont exist ${id}`);
                this.logger.debug(`Movie dont exist 2 ${id}`);
                this.logger.warn(`Movie dont exist  3 ${id}`);
                // this.logger.error(`Movie not found: ${id}`);

                // this.logger.error(`Failed to find movie with ID `);
                //   this.logger.warn('Movie dont exist', movieId);
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
