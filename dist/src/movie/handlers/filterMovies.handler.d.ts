import { ICommandHandler } from '@nestjs/cqrs';
import { FilterMoviesCommand } from '../commands';
import { LoggerService } from '@nestjs/common';
import { MovieRepository } from '../repositories/movie.repository';
import { Cache } from 'cache-manager';
export declare class FilterMoviesHandler implements ICommandHandler<FilterMoviesCommand> {
    private readonly logger;
    private readonly cacheManager;
    private readonly movieRepository;
    constructor(logger: LoggerService, cacheManager: Cache, movieRepository: MovieRepository);
    execute(command: FilterMoviesCommand): Promise<unknown>;
}
