import { CreateMovieReviewDto } from '@/movie/dto/create-review.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class MovieGetReviewsByMovieService {
    private readonly logger = new Logger(MovieGetReviewsByMovieService.name);
    constructor(private prisma: PrismaService) {}

    async getReviewsByMovie(movieId: number) {
        try {
            const reviewMovies = await this.prisma.reviews.findMany({
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

            throw new Error('Failed to fetch reviews');
        }
    }
}
