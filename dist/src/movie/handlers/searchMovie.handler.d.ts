import { IQueryHandler } from '@nestjs/cqrs';
import { SearchMovieQuery } from '../queries/searchMovie.query';
import { MovieRepository } from '@/movie/repositories/movie.repository';
import { Cache } from 'cache-manager';
export declare class SearchMovieHandler implements IQueryHandler<SearchMovieQuery> {
    private readonly movieRepository;
    private readonly cacheManager;
    constructor(movieRepository: MovieRepository, cacheManager: Cache);
    execute(query: SearchMovieQuery): Promise<{
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
    } | {
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
