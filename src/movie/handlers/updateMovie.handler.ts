import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateMovieCommand } from '../commands/updateMovie.command';
import { PrismaService } from '@/prisma/prisma.service';
import { BadRequestException } from '@nestjs/common';
import { Movie } from '@prisma/client';

@CommandHandler(UpdateMovieCommand)
export class UpdateMovieHandler implements ICommandHandler<UpdateMovieCommand> {
    constructor(private readonly prisma: PrismaService) {}

    async execute(command: UpdateMovieCommand): Promise<Movie> {
        const { id, updateMovieDto } = command;

        try {
            return await this.prisma.movie.update({
                where: { id },
                data: updateMovieDto,
            });
        } catch (error) {
            console.error('Error updating movie:', error);
            throw new BadRequestException('Invalid data format');
        }
    }
}
