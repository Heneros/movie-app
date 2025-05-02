import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RemoveMovieCommand } from '../commands/removeMovie.command';
import { MovieRepository } from '@/movie/repositories/movie.repository';
import { Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { RedisPrefixEnum } from '@/data/redis-prefix-enum';
import { Cache } from 'cache-manager';

@CommandHandler(RemoveMovieCommand)
export class RemoveMovieHandler implements ICommandHandler<RemoveMovieCommand> {
    constructor(
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
        private readonly movieRepository: MovieRepository,
    ) {}
    async execute(command: RemoveMovieCommand) {
        const { id } = command;

        const movie = await this.movieRepository.removeMovie(id);

        await this.cacheManager.del(`${RedisPrefixEnum.MOVIE}:${id}`);

        await this.cacheManager.del(
            `${RedisPrefixEnum.MOVIE}:${RedisPrefixEnum.MOVIE_LIST}`,
        );
        return movie;
    }
}
