import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindDraftsMovieQuery } from '../queries/findDrafts.query';
import { PrismaService } from '@/prisma/prisma.service';
import { PAGINATION_LIMIT } from '@/data/defaultData';

@QueryHandler(FindDraftsMovieQuery)
export class FindDraftsHandler implements IQueryHandler<FindDraftsMovieQuery> {
    constructor(private readonly prisma: PrismaService) {}

    async execute(query: FindDraftsMovieQuery) {
        const { skip } = query;
        return this.prisma.movie.findMany({
            skip,
            take: PAGINATION_LIMIT,
            where: { published: false },
        });
    }
}
