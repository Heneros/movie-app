import { CreateMovieReviewDto } from '@/movie/dto/create-review.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class MovieGetAllReviewService {
    private readonly logger = new Logger(MovieGetAllReviewService.name);

    constructor(private prisma: PrismaService) {}

    async getAllReviews() {
        try {
            // console.log('', movieId, auId);
            const reviews = this.prisma.reviews.findMany({});

            return reviews;
        } catch (error) {
            this.logger.error(
                `No reviews in Reviews don\'t exist`,
                {
                    message: error.message,
                    stack: error.stack,
                },
            );

            if (error instanceof BadRequestException) {
                throw error;
            }

            throw new Error("Reviews don't exist");
        }
    }
}
