import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateMovieCommand } from '../commands/updateMovie.command';
import { BadRequestException, Inject } from '@nestjs/common';
import { Movie } from '@prisma/client';
import { MovieRepository } from '../repositories/movie.repository';
import { RedisPrefixEnum } from '@/data/redis-prefix-enum';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@CommandHandler(UpdateMovieCommand)
export class UpdateMovieHandler implements ICommandHandler<UpdateMovieCommand> {
    constructor(
        // private readonly prisma: PrismaService
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        private readonly movieRepository: MovieRepository,
    ) {}

    async execute(command: UpdateMovieCommand): Promise<Movie> {
        const { id, updateMovieDto } = command;

        const cacheKey = `${RedisPrefixEnum.MOVIE}:${id}`;
        try {
            await this.cacheManager.del(cacheKey);
            return await this.movieRepository.updateMovie({
                id,
                updateMovieDto,
            });
        } catch (error) {
            console.error('Error updating movie:', error);
            throw new BadRequestException('Invalid data format');
        }
    }
}
