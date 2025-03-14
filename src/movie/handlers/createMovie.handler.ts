import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateMovieCommand } from '../commands/createMovie.command';
import { PrismaService } from '@/prisma/prisma.service';
import { BadRequestException } from '@nestjs/common';

@CommandHandler(CreateMovieCommand)
export class CreateMovieHandler implements ICommandHandler<CreateMovieCommand> {
    constructor(private prisma: PrismaService) {}

    async execute(command: CreateMovieCommand) {
        const { createMovieDto } = command;

        const movieTitle = await this.prisma.movie.findUnique({
            where: { title: createMovieDto.title },
        });

        if (movieTitle) {
            throw new BadRequestException(
                'Movie already exists with this title',
            );
        }

        return this.prisma.movie.create({
            data: { ...createMovieDto, authorId: createMovieDto.authorId },
        });
    }
}
