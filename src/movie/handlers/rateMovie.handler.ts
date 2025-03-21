import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateMovieCommand } from '../commands/createMovie.command';
import { PrismaService } from '@/prisma/prisma.service';
import { BadRequestException } from '@nestjs/common';
import { RateMovieCommand } from '../commands/rateMovie.command';
import { MovieRepository } from '@/movie/repositories/movie.repository';

@CommandHandler(RateMovieCommand)
export class RateMovieHandler implements ICommandHandler<RateMovieCommand> {
    constructor(private readonly movieRepository: MovieRepository) {}

    async execute(command: RateMovieCommand) {
        const { movieId, userId, value } = command;
        const existingRating = await this.movieRepository.findUniqueRating(
            movieId,
            userId,
        );
        // console.log(existingRating);

        if (existingRating) {
            await this.movieRepository.updateRating(existingRating.id, value);
        } else {
            await this.movieRepository.createRating(movieId, userId, value);
        }

        // console.log(value, movieId, userId);
        const ratings =
            await this.movieRepository.getAllRatingsForMovie(movieId);

        const total = ratings.reduce((sum, r) => sum + r.value, 0);
        const avg = ratings.length > 0 ? total / ratings.length : 0;

        //      console.log(movieId, avg);
        return await this.movieRepository.updateMovie({ id: movieId, avg });

    }
}
