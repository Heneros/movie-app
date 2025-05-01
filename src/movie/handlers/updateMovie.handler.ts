import { UpdateMovieCommand } from '../commands/updateMovie.command';
import { MovieRepository } from '../repositories/movie.repository';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestException, Inject } from '@nestjs/common';
import { RedisPrefixEnum } from '@/data/redis-prefix-enum';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Movie } from '@prisma/client';
import { CACHE_TTL } from '@/data/ttl';
import { Cache } from 'cache-manager';

@CommandHandler(UpdateMovieCommand)
export class UpdateMovieHandler implements ICommandHandler<UpdateMovieCommand> {
    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        private readonly movieRepository: MovieRepository,
    ) {}

    async execute(command: UpdateMovieCommand): Promise<Movie> {
        const { id, updateMovieDto } = command;

        const cacheKey = `${RedisPrefixEnum.MOVIE}:${id}`;
        try {
            await this.cacheManager.del(cacheKey);

            const movie = await this.movieRepository.updateMovie({
                id,
                updateMovieDto,
            });

            await this.cacheManager.set(cacheKey, movie.id, CACHE_TTL.ONE_DAY);
            return movie;
        } catch (error) {
            console.error('Error updating movie:', error);
            throw new BadRequestException('Invalid data format');
        }
    }
}
