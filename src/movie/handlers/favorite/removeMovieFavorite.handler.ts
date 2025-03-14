import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { PrismaService } from '@/prisma/prisma.service';
import { BadRequestException } from '@nestjs/common';
import { RemoveMovieFavCommand } from '../../commands/favorite/removeMovieFavorite.command';

@CommandHandler(RemoveMovieFavCommand)
export class RemoveMovieFavHandler
    implements ICommandHandler<RemoveMovieFavCommand>
{
    constructor(private readonly prisma: PrismaService) {}

    async execute(command: RemoveMovieFavCommand) {
        const { movieId, userId } = command;

        const movieFound = await this.prisma.userFavoriteMovies.findUnique({
            where: {
                userId_movieId: { movieId, userId },
            },
        });

        if (!movieFound) {
            throw new BadRequestException('Movie not found in favorites');
        }

        await this.prisma.userFavoriteMovies.delete({
            where: {
                userId_movieId: { movieId, userId },
            },
        });

        return movieFound;
    }
}
