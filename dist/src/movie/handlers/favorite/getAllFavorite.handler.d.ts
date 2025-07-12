import { GetAllFavoritesQuery } from '@/movie/queries/favorite/getAllFavorite.query';
import { MovieRepository } from '@/movie/repositories/movie.repository';
import { IQueryHandler } from '@nestjs/cqrs';
export declare class GetAllFavoritesHandler implements IQueryHandler<GetAllFavoritesQuery> {
    private readonly movieRepository;
    constructor(movieRepository: MovieRepository);
    execute(query: GetAllFavoritesQuery): Promise<{
        movieId: number;
        userId: number;
    }[]>;
}
