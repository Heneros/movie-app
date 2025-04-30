import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindAllMovieQuery } from '../queries/findAllMovie.query';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

import { Inject, NotFoundException } from '@nestjs/common';
import { MovieRepository } from './../repositories/movie.repository';
import { Movie } from '@prisma/client';
import { CACHE_TTL } from '@/data/ttl';

@QueryHandler(FindAllMovieQuery)
export class FindAllMovieHandler implements IQueryHandler<FindAllMovieQuery> {
    constructor(
        // private readonly prisma: PrismaService,
        private readonly movieRepository: MovieRepository,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) {}

    async execute(query: FindAllMovieQuery) {
        const { skip } = query;
        const cacheKey = `movies:${skip}`;

        const cachedData = await this.cacheManager.get<Movie[]>(cacheKey);
        const start = Date.now();
        if (cachedData) {
            console.log('Cash Data', Date.now() - start, 'ms');
            return { allMovies: cachedData };
        }

        const allMovies = await this.movieRepository.findAllMovie(skip);

        if (allMovies.length === 0) {
            throw new NotFoundException('No movies Exist');
        }

        await this.cacheManager.set(cacheKey, allMovies, CACHE_TTL.ONE_MINUTE);
        console.log('BD', Date.now() - start, 'ms');
        return { allMovies };
    }
}
