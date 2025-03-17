import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateMovieCommand } from '../commands/updateMovie.command';
import { PrismaService } from '@/prisma/prisma.service';
import { BadRequestException } from '@nestjs/common';
import { Movie } from '@prisma/client';
import { MovieRepository } from '../repositories/movie.repository';

@CommandHandler(UpdateMovieCommand)
export class UpdateMovieHandler implements ICommandHandler<UpdateMovieCommand> {
    constructor(
        // private readonly prisma: PrismaService
        private readonly movieRepository: MovieRepository,
    ) {}

    async execute(command: UpdateMovieCommand): Promise<Movie> {
        const { id, updateMovieDto } = command;

        try {
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
