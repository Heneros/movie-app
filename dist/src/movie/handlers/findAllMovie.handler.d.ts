import { IQueryHandler } from '@nestjs/cqrs';
import { FindAllMovieQuery } from '../queries/findAllMovie.query';
import { Cache } from 'cache-manager';
import { MovieRepository } from './../repositories/movie.repository';
export declare class FindAllMovieHandler implements IQueryHandler<FindAllMovieQuery> {
    private readonly movieRepository;
    private cacheManager;
    constructor(movieRepository: MovieRepository, cacheManager: Cache);
    execute(query: FindAllMovieQuery): Promise<{
        allMovies: {
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
        }[];
    }>;
}
