import { CreateReviewCommand } from '@/movie/commands/reviews/createReview.command';
import { MovieRepository } from '@/movie/repositories/movie.repository';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(CreateReviewCommand)
export class CreateMovieReviewHandler
    implements ICommandHandler<CreateReviewCommand>
{
    constructor(private readonly movieRepository: MovieRepository) {}

    async execute(command: CreateReviewCommand) {
        const { movieId, auId, createMovieReviewDto } = command;

        console.log(movieId, auId, createMovieReviewDto);
    }
}
