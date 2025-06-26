import { ICommandHandler } from '@nestjs/cqrs';
import { AddMovieFavCommand } from '../../commands/favorite/addMovieFavorite.command';
import { MovieRepository } from '@/movie/repositories/movie.repository';
export declare class AddMovieFavoriteHandler implements ICommandHandler<AddMovieFavCommand> {
    private readonly movieRepository;
    constructor(movieRepository: MovieRepository);
    execute(command: AddMovieFavCommand): Promise<{
        movieId: number;
        userId: number;
    }>;
}
