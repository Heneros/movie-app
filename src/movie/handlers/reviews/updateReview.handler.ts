import { UpdateReviewCommand } from '@/movie/commands/reviews/updateReview.command';
import { MovieRepository } from '@/movie/repositories/movie.repository';
import { ReviewRepository } from '@/movie/repositories/review.repository';
import { BadRequestException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Reviews } from '@prisma/client';
import { differenceInMinutes } from 'date-fns';

@CommandHandler(UpdateReviewCommand)
export class UpdateReviewHandler
    implements ICommandHandler<UpdateReviewCommand>
{
    // private readonly logger = new Logger(UpdateReviewHandler.name);

    constructor(private readonly reviewRepository: ReviewRepository) {}

    async execute(command: UpdateReviewCommand): Promise<Reviews | null> {
        const { reviewId, userId, createMovieReviewDto } = command;

        const review = await this.reviewRepository.findByIdAndAuthor(
            reviewId,
            userId,
        );

        if (!review) {
            throw new BadRequestException('Review does not exist');
        }
        const now = new Date();
        const reviewCreatedAt = new Date(review.createdAt);
        const minutesPassed = differenceInMinutes(now, reviewCreatedAt);

        if (minutesPassed > 15) {
            throw new BadRequestException(
                'You can only edit the review within 15 minutes of creation.',
            );
        }

        return await this.reviewRepository.updateReview(reviewId, userId, {
            review: createMovieReviewDto.review,
            positive: createMovieReviewDto.positive,
        });
        // const review = await this.reviewRepository.findByIdAndAuthor(reviewId, auId);
    }
}
