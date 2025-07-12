import { IQueryHandler } from '@nestjs/cqrs';
import { MovieRepository } from '@/movie/repositories/movie.repository';
import { Cache } from 'cache-manager';
import { FindAuthorMovieQuery } from '../queries/findAuthorMovie.query';
export declare class FindAuthorHandler implements IQueryHandler<FindAuthorMovieQuery> {
    private cacheManager;
    private readonly movieRepository;
    constructor(cacheManager: Cache, movieRepository: MovieRepository);
    execute(query: FindAuthorMovieQuery): Promise<{
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
    }[]>;
}
