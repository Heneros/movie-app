import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindDraftsMovieQuery } from '../queries/findDrafts.query';
import { MovieRepository } from '@/movie/repositories/movie.repository';

@QueryHandler(FindDraftsMovieQuery)
export class FindDraftsHandler implements IQueryHandler<FindDraftsMovieQuery> {
    constructor(
        // private readonly prisma: PrismaService
        private readonly movieRepository: MovieRepository,
    ) {}

    async execute(query: FindDraftsMovieQuery) {
        const { skip } = query;
        return this.movieRepository.findAllDraftsMovie(skip);
    }
}
