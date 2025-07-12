import { ICommandHandler } from '@nestjs/cqrs';
import { RemoveMovieCommand } from '../commands/removeMovie.command';
import { MovieRepository } from '@/movie/repositories/movie.repository';
import { Cache } from 'cache-manager';
export declare class RemoveMovieHandler implements ICommandHandler<RemoveMovieCommand> {
    private readonly cacheManager;
    private readonly movieRepository;
    constructor(cacheManager: Cache, movieRepository: MovieRepository);
    execute(command: RemoveMovieCommand): Promise<[import(".prisma/client").Prisma.BatchPayload, import(".prisma/client").Prisma.BatchPayload, {
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
    }]>;
}
