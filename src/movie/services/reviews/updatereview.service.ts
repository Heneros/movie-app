import { CreateMovieReviewDto } from '@/movie/dto/create-review.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { differenceInMinutes } from 'date-fns';

@Injectable()
export class MovieUpdateReviewService {
    private readonly logger = new Logger(MovieUpdateReviewService.name);
    constructor(private prisma: PrismaService) {}

    async updateReviewMovie(
        reviewId: number,
        auId: number,
        createMovieReviewDto: CreateMovieReviewDto,
    ): Promise<CreateMovieReviewDto | null> {
        try {
            const review = await this.prisma.reviews.findFirst({
                where: {
                    id: reviewId,
                    auId: auId,
                },
            });

            if (!review) {
                throw new BadRequestException('Review not exist');
            }

            const now = new Date();
            const reviewCreatedAt = new Date(review.createdAt);

            const minutesPassed = differenceInMinutes(now, reviewCreatedAt);

            if (minutesPassed > 15) {
                throw new BadRequestException(
                    'You can only edit the review within 15 minutes of creation.',
                );
            }

            const reviewUpdate = await this.prisma.reviews.update({
                where: {
                    id: reviewId,
                    auId: auId,
                },
                data: {
                    review: createMovieReviewDto.review,
                    positive: createMovieReviewDto.positive,
                },
            });
            return reviewUpdate;
        } catch (error) {
            this.logger.error(`Error no review for movie ${reviewId}`, {
                message: error.message,
                stack: error.stack,
            });
            if (error instanceof BadRequestException) {
                throw error;
            }
            throw new Error('Error receive review for movie');
        }
    }
}
