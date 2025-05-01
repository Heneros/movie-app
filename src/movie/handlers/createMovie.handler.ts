import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateMovieCommand } from '../commands/createMovie.command';
import { BadRequestException, Inject } from '@nestjs/common';
import { MovieRepository } from '../repositories/movie.repository';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Movie } from '@prisma/client';
import { RedisPrefixEnum } from '@/data/redis-prefix-enum';
import { CACHE_TTL } from '@/data/ttl';

@CommandHandler(CreateMovieCommand)
export class CreateMovieHandler implements ICommandHandler<CreateMovieCommand> {
    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        private readonly movieRepository: MovieRepository,
    ) {}

    async execute(command: CreateMovieCommand) {
        const { createMovieDto } = command;

        const movieTitle = await this.movieRepository.findUniqueMovie({
            title: createMovieDto.title,
        });

        if (movieTitle) {
            throw new BadRequestException(
                'Movie already exists with this title',
            );
        }
        const movie = await this.movieRepository.createMovie(
            command.createMovieDto,
        );
        const listCacheKey = RedisPrefixEnum.MOVIE_LIST;

        await this.cacheManager.del(listCacheKey);

        const movieCacheKey = `${RedisPrefixEnum.MOVIE}:${movie.id}`;

        await this.cacheManager.set(
            movieCacheKey,
            movie,
            CACHE_TTL.FIVE_MINUTE,
        );

        return movie;
    }
}
