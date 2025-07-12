import { ICommandHandler } from '@nestjs/cqrs';
import { RemoveMovieFavCommand } from '../../commands/favorite/removeMovieFavorite.command';
import { MovieRepository } from '@/movie/repositories/movie.repository';
export declare class RemoveMovieFavHandler implements ICommandHandler<RemoveMovieFavCommand> {
    private readonly movieRepository;
    constructor(movieRepository: MovieRepository);
    execute(command: RemoveMovieFavCommand): Promise<{
        movieId: number;
        userId: number;
    }>;
}
