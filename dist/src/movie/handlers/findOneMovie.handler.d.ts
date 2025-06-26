import { IQueryHandler } from '@nestjs/cqrs';
import { FindOneMovieQuery } from '../queries/findOneMovie.query';
import { MovieRepository } from '@/movie/repositories/movie.repository';
import { LoggerService } from '@nestjs/common';
import { Cache } from 'cache-manager';
export declare class FindOneHandler implements IQueryHandler<FindOneMovieQuery> {
    private readonly logger;
    private cacheManager;
    private readonly movieRepository;
    constructor(logger: LoggerService, cacheManager: Cache, movieRepository: MovieRepository);
    execute(query: FindOneMovieQuery): Promise<{
        description: string;
        title: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        category: string;
        year: number;
        published: boolean;
        galleryId: number | null;
        previewId: number | null;
        avgRating: number;
        actorsList: string[];
        authorId: number | null;
    }>;
}
