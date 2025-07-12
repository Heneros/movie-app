import { ICommandHandler } from '@nestjs/cqrs';
import { RateMovieCommand } from '../commands/rateMovie.command';
import { MovieRepository } from '@/movie/repositories/movie.repository';
import { Cache } from 'cache-manager';
export declare class RateMovieHandler implements ICommandHandler<RateMovieCommand> {
    private readonly cacheManager;
    private readonly movieRepository;
    constructor(cacheManager: Cache, movieRepository: MovieRepository);
    execute(command: RateMovieCommand): Promise<{
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
