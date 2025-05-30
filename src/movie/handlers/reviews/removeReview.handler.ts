import { RemoveReviewCommand } from '@/movie/commands/reviews/removeReview.command';
import { ReviewRepository } from '@/movie/repositories/review.repository';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(RemoveReviewCommand)
export class RemoveMReviewHandler
    implements ICommandHandler<RemoveReviewCommand>
{
    constructor(
        private readonly eventBus: EventBus,
        private readonly reviewRepository: ReviewRepository,
    ) {}

    async execute(command: RemoveReviewCommand) {
        const { reviewId, userId } = command;

        try {
            const review = await this.reviewRepository.findByIdAndAuthor(
                reviewId,
                userId,
            );
            // console.log(review);

            if (!review) {
                throw new NotFoundException('Review not exist');
            }

            const res = await this.reviewRepository.removeReview(
                reviewId,
                userId,
            );

            return `Review was deleted ${res.id}`;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
        }
    }
}
