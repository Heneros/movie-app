import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindDraftsMovieQuery } from '../queries/findDrafts.query';
import { PrismaService } from '@/prisma/prisma.service';
import { PAGINATION_LIMIT } from '@/data/defaultData';
import { MovieRepository } from '@/movie/repositories/movie.repository';

@QueryHandler(FindDraftsMovieQuery)
export class FindDraftsHandler implements IQueryHandler<FindDraftsMovieQuery> {
    constructor(
        // private readonly prisma: PrismaService
        private readonly movieRepository: MovieRepository,
    ) {}

    async execute(query: FindDraftsMovieQuery) {
        const { skip } = query;
        return this.movieRepository.findAllMovie(skip);
    }
}
