import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindAllMovieQuery } from '../queries/findAllMovie.query';
import { PrismaService } from '@/prisma/prisma.service';
import { Inject } from '@nestjs/common';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { PAGINATION_LIMIT } from '@/data/defaultData';
import { FindDraftsMovieQuery } from '../queries/findDrafts.query';

@QueryHandler(FindDraftsMovieQuery)
export class FindDraftsMovieHandler
    implements IQueryHandler<FindAllMovieQuery>
{
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
