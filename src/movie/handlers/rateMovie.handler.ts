import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateMovieCommand } from '../commands/createMovie.command';
import { PrismaService } from '@/prisma/prisma.service';
import { BadRequestException, Inject } from '@nestjs/common';
import { RateMovieCommand } from '../commands/rateMovie.command';
import { MovieRepository } from '@/movie/repositories/movie.repository';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { RedisPrefixEnum } from '@/data/redis-prefix-enum';
import { CACHE_TTL } from '@/data/ttl';

@CommandHandler(RateMovieCommand)
export class RateMovieHandler implements ICommandHandler<RateMovieCommand> {
    constructor(
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
        // @InjectRedis() private readonly redis: Redis,
        private readonly movieRepository: MovieRepository,
    ) {}

    async execute(command: RateMovieCommand) {
        const { movieId, userId, value } = command;
        const existingRating = await this.movieRepository.findUniqueRating(
            movieId,
            userId,
        );
        // console.log(existingRating);
        const cacheKey = `${RedisPrefixEnum.MOVIE}:${movieId}`;

        if (existingRating) {
            await this.movieRepository.updateRating(existingRating.id, value);
            await this.cacheManager.del(cacheKey);
        } else {
            await this.movieRepository.createRating(movieId, userId, value);
        }

        // console.log(value, movieId, userId);
        const ratings =
            await this.movieRepository.getAllRatingsForMovie(movieId);

        const total = ratings.reduce((sum, r) => sum + r.value, 0);
        const avg = ratings.length > 0 ? total / ratings.length : 0;

        // const keys = await this.redis.keys(pattern);
        // console.log(keys);
        // if (keys.length > 0) {
        //     await this.redis.del(...keys);
        // }
        //      console.log(movieId, avg);
        await this.cacheManager.set(cacheKey, movieId, CACHE_TTL.TWO_HOUR);
        return await this.movieRepository.updateMovie({ id: movieId, avg });
    }
}
