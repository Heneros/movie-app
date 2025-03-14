import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { SearchMovieQuery } from '../queries/searchMovie.query';
import { PrismaService } from '@/prisma/prisma.service';
import { BadRequestException } from '@nestjs/common';
import { PAGINATION_LIMIT } from '@/data/defaultData';

@QueryHandler(SearchMovieQuery)
export class SearchMovieHandler implements IQueryHandler<SearchMovieQuery> {
    constructor(private readonly prisma: PrismaService) {}

    async execute(query: SearchMovieQuery) {
        const { searchText, skip } = query;

        try {
            return await this.prisma.movie.findMany({
                skip,
                take: PAGINATION_LIMIT,
                where: {
                    title: {
                        contains: searchText,
                        mode: 'insensitive',
                    },
                },
                // include: {
                //     author: true,
                // },
            });
        } catch (error) {
            console.error('Error searching movies:', error);
            throw new BadRequestException('Failed to search movies');
        }
    }
}
