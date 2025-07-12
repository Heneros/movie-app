import { IQueryHandler } from '@nestjs/cqrs';
import { FindAllMovieQuery } from '../queries/findAllMovie.query';
import { MovieRepository } from './../repositories/movie.repository';
import { RedisService } from '@/redis/redis.service';
export declare class FindAllMovieHandler implements IQueryHandler<FindAllMovieQuery> {
    private readonly movieRepository;
    private readonly redisService;
    constructor(movieRepository: MovieRepository, redisService: RedisService);
    execute(query: FindAllMovieQuery): Promise<{
        allMovies: string;
    } | {
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
