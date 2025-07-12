import { ICommandHandler } from '@nestjs/cqrs';
import { CreateMovieCommand } from '../commands/createMovie.command';
import { MovieRepository } from '../repositories/movie.repository';
import { Cache } from 'cache-manager';
export declare class CreateMovieHandler implements ICommandHandler<CreateMovieCommand> {
    private cacheManager;
    private readonly movieRepository;
    constructor(cacheManager: Cache, movieRepository: MovieRepository);
    execute(command: CreateMovieCommand): Promise<{
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
