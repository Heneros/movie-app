import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AddMovieFavCommand } from '../../commands/favorite/addMovieFavorite.command';
import { PrismaService } from '@/prisma/prisma.service';
import { BadRequestException } from '@nestjs/common';
import { MovieRepository } from '@/movie/repositories/movie.repository';

@CommandHandler(AddMovieFavCommand)
export class AddMovieFavoriteHandler
    implements ICommandHandler<AddMovieFavCommand>
{
    constructor(private readonly movieRepository: MovieRepository) {}

    async execute(command: AddMovieFavCommand) {
        const { movieId, userId } = command;
        const isFavorite = await this.movieRepository.findMovieUniqueWithAuthor(
            userId,
            movieId,
        );

        if (isFavorite) {
            throw new BadRequestException('Movie already exists in favorites');
        }
        return this.movieRepository.addMovieFavWithAuthor(movieId, userId);
    }
}
