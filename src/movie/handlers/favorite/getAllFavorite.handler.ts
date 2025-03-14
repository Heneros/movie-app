import { PAGINATION_LIMIT } from '@/data/defaultData';
import { GetAllFavoritesQuery } from '@/movie/queries/getAllFavorite.query';
import { PrismaService } from '@/prisma/prisma.service';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

@QueryHandler(GetAllFavoritesQuery)
export class GetAllFavoritesHandler
    implements IQueryHandler<GetAllFavoritesQuery>
{
    constructor(private readonly prisma: PrismaService) {}

    async execute(query: GetAllFavoritesQuery) {
        const { userId, skip } = query;
        return this.prisma.userFavoriteMovies.findMany({
            skip,
            take: PAGINATION_LIMIT,
            where: { userId },
        });
    }
}
