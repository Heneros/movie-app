import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RemoveMovieCommand } from '../commands/removeMovie.command';
import { PrismaService } from '@/prisma/prisma.service';
import { MovieRepository } from '@/movie/repositories/movie.repository';

@CommandHandler(RemoveMovieCommand)
export class RemoveMovieHandler implements ICommandHandler<RemoveMovieCommand> {
    constructor(private readonly movieRepository: MovieRepository) {}
    async execute(command: RemoveMovieCommand) {
        const { id } = command;

        return this.movieRepository.removeMovie(id);
    }
}
