import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RemoveMovieCommand } from '../commands/removeMovie.command';
import { MovieRepository } from '@/movie/repositories/movie.repository';

@CommandHandler(RemoveMovieCommand)
export class RemoveMovieHandler implements ICommandHandler<RemoveMovieCommand> {
    constructor(private readonly movieRepository: MovieRepository) {}
    async execute(command: RemoveMovieCommand) {
        const { id } = command;

        const movie = await this.movieRepository.removeMovie(id);

        return movie;
    }
}
