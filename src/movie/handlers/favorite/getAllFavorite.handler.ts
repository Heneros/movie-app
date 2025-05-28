import { PAGINATION_LIMIT } from '@/data/defaultData';
import { GetAllFavoritesQuery } from '@/movie/queries/favorite/getAllFavorite.query';
import { MovieRepository } from '@/movie/repositories/movie.repository';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

@QueryHandler(GetAllFavoritesQuery)
export class GetAllFavoritesHandler
    implements IQueryHandler<GetAllFavoritesQuery>
{
    constructor(
        // private readonly prisma: PrismaService,
        private readonly movieRepository: MovieRepository,
    ) {}

    async execute(query: GetAllFavoritesQuery) {
        const { userId, skip } = query;
        // console.log('user.id, skip', userId, skip);
        return await this.movieRepository.findManyInFav(userId, skip);
    }
}
