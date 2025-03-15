import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { PrismaService } from '@/prisma/prisma.service';
import { BadRequestException } from '@nestjs/common';
import { RemoveMovieFavCommand } from '../../commands/favorite/removeMovieFavorite.command';
import { MovieRepository } from '@/movie/repositories/movie.repository';

@CommandHandler(RemoveMovieFavCommand)
export class RemoveMovieFavHandler
    implements ICommandHandler<RemoveMovieFavCommand>
{
    constructor(private readonly movieRepository: MovieRepository) {}

    async execute(command: RemoveMovieFavCommand) {
        const { movieId, userId } = command;

        // console.log('', movieId, userId);
        const movieFound = await this.movieRepository.findManyInFav(
            movieId,
            userId,
        );

        if (!movieFound) {
            throw new BadRequestException('Movie not found in favorites');
        }

        await this.movieRepository.removeFromFav(movieId, userId);

        return movieFound;
    }
}
