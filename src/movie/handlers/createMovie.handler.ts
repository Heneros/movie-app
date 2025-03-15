import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateMovieCommand } from '../commands/createMovie.command';
import { BadRequestException } from '@nestjs/common';
import { MovieRepository } from '../repositories/movie.repository';

@CommandHandler(CreateMovieCommand)
export class CreateMovieHandler implements ICommandHandler<CreateMovieCommand> {
    constructor(private readonly movieRepository: MovieRepository) {}

    async execute(command: CreateMovieCommand) {
        const { createMovieDto } = command;
        // const movieTitle = await this.prisma.movie.findUnique({
        //     where: { title: createMovieDto.title },
        // });

        const movieTitle = await this.movieRepository.findUniqueMovie({
            title: createMovieDto.title,
        });

        if (movieTitle) {
            throw new BadRequestException(
                'Movie already exists with this title',
            );
        }

        return this.movieRepository.createMovie(
            command.createMovieDto,
            // data: { ...createMovieDto, authorId: createMovieDto.authorId },
        );
    }
}
