import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindAllMovieQuery } from '../queries/findAllMovie.query';
import { PrismaService } from '@/prisma/prisma.service';
import { Inject, NotFoundException } from '@nestjs/common';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { PAGINATION_LIMIT } from '@/data/defaultData';
import { Movie } from '@prisma/client';

@QueryHandler(FindAllMovieQuery)
export class FindAllMovieHandler implements IQueryHandler<FindAllMovieQuery> {
    constructor(
        private readonly prisma: PrismaService,

        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) {}

    async execute(query: FindAllMovieQuery) {
        const { skip } = query;

        // try {
        const cacheKey = `movies:${skip}`;

        const cachedData = await this.cacheManager.get<Movie[]>(cacheKey);

        if (cachedData && cachedData.length > 0) {
            const ttl = await this.cacheManager.ttl(cacheKey);
            const remainingTime = ttl > 0 ? ttl : 0;
            console.log(
                `Cache hit: ${cacheKey}, TTL: ${remainingTime} seconds`,
            );
            return cachedData;
        }

        const allMovies = await this.prisma.movie.findMany({
            skip,
            take: PAGINATION_LIMIT,
            orderBy: {
                id: 'asc',
            },
        });

        if (allMovies.length === 0) {
            throw new NotFoundException('No movies Exist');
        }

        await this.cacheManager.set(cacheKey, allMovies, 3500);
        return { allMovies };
        // } catch (error) {}
    }
}
