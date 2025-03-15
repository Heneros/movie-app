import { PAGINATION_LIMIT } from '@/data/defaultData';
import { PrismaService } from '@/prisma/prisma.service';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class MovieGetAllReviewService {
    private readonly logger = new Logger(MovieGetAllReviewService.name);

    constructor(private prisma: PrismaService) {}

    async getAllReviews(page: number = 1) {
        try {
            const pageSize = PAGINATION_LIMIT;

            const skip = (page - 1) * pageSize;
            const reviews = this.prisma.reviews.findMany({
                skip,
                take: pageSize,
                orderBy: { createdAt: 'desc' },
            });

            return reviews;
        } catch (error) {
            this.logger.error(`No reviews in Reviews don\'t exist`, {
                message: error.message,
                stack: error.stack,
            });

            if (error instanceof BadRequestException) {
                throw error;
            }

            throw new Error("Reviews don't exist");
        }
    }
}
