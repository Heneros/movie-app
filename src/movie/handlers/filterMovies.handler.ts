import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { FilterMoviesCommand } from '../commands';
import { BadRequestException, Inject, LoggerService } from '@nestjs/common';
import { MovieRepository } from '../repositories/movie.repository';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { RedisPrefixEnum } from '@/data/redis-prefix-enum';
import { CACHE_TTL } from '@/data/ttl';
import { Movie } from '@prisma/client';

@CommandHandler(FilterMoviesCommand)
export class FilterMoviesHandler
    implements ICommandHandler<FilterMoviesCommand>
{
    constructor(
        @Inject(WINSTON_MODULE_NEST_PROVIDER)
        private readonly logger: LoggerService,
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
        private readonly movieRepository: MovieRepository,
    ) {}

    async execute(command: FilterMoviesCommand) {
        const { filters } = command;
        // this.logger.debug('debug', 'Received filters:', filters);

        const nameCache = `${RedisPrefixEnum.MOVIE}:filters:${filters}`;

        const cached = await this.cacheManager.get(nameCache);
        if (cached) {
            this.logger.log(
                'info',
                `Movies found in cache for key: ${nameCache}`,
            );
            return cached;
        }
        try {
            const result = await this.movieRepository.filterMovie(filters);
            if (!result || result.length === 0) {
                this.logger.warn(`No movies found for filters:`, filters);
                throw new BadRequestException('No movies found');
            }

            await this.cacheManager.set(nameCache, result, CACHE_TTL.ONE_DAY);
            return result;
        } catch (error) {
            this.logger.error('Error filtering movies', error);
            throw error;
        }
    }
}
