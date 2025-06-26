import { UpdateMovieCommand } from '../commands/updateMovie.command';
import { MovieRepository } from '../repositories/movie.repository';
import { ICommandHandler } from '@nestjs/cqrs';
import { Movie } from '@prisma/client';
import { Cache } from 'cache-manager';
export declare class UpdateMovieHandler implements ICommandHandler<UpdateMovieCommand> {
    private cacheManager;
    private readonly movieRepository;
    constructor(cacheManager: Cache, movieRepository: MovieRepository);
    execute(command: UpdateMovieCommand): Promise<Movie>;
}
