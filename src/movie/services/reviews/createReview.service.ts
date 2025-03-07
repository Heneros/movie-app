import { CreateMovieReviewDto } from '@/movie/dto/create-review.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class MovieCreateReviewService {
    private readonly logger = new Logger(MovieCreateReviewService.name);

    constructor(private prisma: PrismaService) {}

    async createReview(
        movieId: number,
        auId: number,
        createMovieReviewDto: CreateMovieReviewDto,
    ) {
        try {
            // console.log('', movieId, auId);
            const review = await this.prisma.reviews.findFirst({
                where: {
                    movieId: movieId,
                    auId: auId,
                },
            });

            if (review) {
                throw new BadRequestException(
                    'You already reviewed this movie.',
                );
            }
            const newReview = await this.prisma.reviews.create({
                data: {
                    review: createMovieReviewDto.review,
                    positive: createMovieReviewDto.positive,
                    movieId: movieId,
                    auId: auId,
                },
            });

            return newReview;
        } catch (error) {
            this.logger.error(
                `Error create reviews for movie ${movieId}, Review already exist`,
                {
                    message: error.message,
                    stack: error.stack,
                },
            );

            if (error instanceof BadRequestException) {
                throw error;
            }

            throw new Error('Review already exist');
        }
    }
}
