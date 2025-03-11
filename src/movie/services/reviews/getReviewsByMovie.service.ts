import { PAGINATION_LIMIT } from '@/data/defaultData';
import { CreateMovieReviewDto } from '@/movie/dto/create-review.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class MovieGetReviewsByMovieService {
    private readonly logger = new Logger(MovieGetReviewsByMovieService.name);
    constructor(private prisma: PrismaService) {}

    async getReviewsByMovie(page: number = 1, movieId: number) {
        try {
            const pageSize = PAGINATION_LIMIT;
            const skip = (page - 1) * pageSize;
            const reviewMovies = await this.prisma.reviews.findMany({
                skip,
                take: pageSize,
                where: {
                    movieId: movieId,
                },
            });

            return reviewMovies;
        } catch (error) {
            // console.error(error);
            this.logger.error(`Error fetching reviews for movie ${movieId}`, {
                message: error.message,
                stack: error.stack,
            });
            if (error instanceof BadRequestException) {
                throw error;
            }
            throw new Error('Failed to fetch reviews');
        }
    }
}
