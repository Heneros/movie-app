import { IQueryHandler } from '@nestjs/cqrs';
import { FindDraftsMovieQuery } from '../queries/findDrafts.query';
import { MovieRepository } from '@/movie/repositories/movie.repository';
import { Cache } from 'cache-manager';
export declare class FindDraftsHandler implements IQueryHandler<FindDraftsMovieQuery> {
    private cacheManager;
    private readonly movieRepository;
    constructor(cacheManager: Cache, movieRepository: MovieRepository);
    execute(query: FindDraftsMovieQuery): Promise<{
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
