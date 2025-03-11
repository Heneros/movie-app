import { CreateMovieReviewDto } from '@/movie/dto/create-review.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class MovieRemoveReviewService {
    private readonly logger = new Logger(MovieRemoveReviewService.name);
    constructor(private prisma: PrismaService) {}

    async removeReviewMovie(
        reviewId: number,
        auId: number,
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

            const reviewUpdate = await this.prisma.reviews.delete({
                where: {
                    id: reviewId,
                    auId: auId,
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

