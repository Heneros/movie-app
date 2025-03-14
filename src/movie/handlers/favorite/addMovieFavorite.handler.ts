import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AddMovieFavCommand } from '../../commands/favorite/addMovieFavorite.command';
import { PrismaService } from '@/prisma/prisma.service';
import { BadRequestException } from '@nestjs/common';

@CommandHandler(AddMovieFavCommand)
export class AddMovieFavoriteHandler
    implements ICommandHandler<AddMovieFavCommand>
{
    constructor(private readonly prisma: PrismaService) {}

    async execute(command: AddMovieFavCommand) {
        const { movieId, userId } = command;

        const movieFound = await this.prisma.userFavoriteMovies.findUnique({
            where: {
                userId_movieId: { movieId, userId },
            },
        });

        if (movieFound) {
            throw new BadRequestException('Movie already exists in favorites');
        }

        return this.prisma.userFavoriteMovies.create({
            data: { movieId, userId },
        });
    }
}
