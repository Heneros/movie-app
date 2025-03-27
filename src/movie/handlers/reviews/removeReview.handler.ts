import { RemoveReviewCommand } from '@/movie/commands/reviews/removeReview.command';
import { ReviewRepository } from '@/movie/repositories/review.repository';
import { BadRequestException } from '@nestjs/common';
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
        const { reviewId, auId } = command;

        try {
            const review = await this.reviewRepository.findByIdAndAuthor(
                reviewId,
                auId,
            );

            if (!review) {
                throw new BadRequestException('Review not exist');
            }

            // const reviewDelete = await this.reviewRepository.removeReview(
            //     reviewId,
            //     auId,
            // );
            // console.log(review);
            // return reviewDelete;
            return await this.reviewRepository.removeReview(reviewId, auId);
        } catch (error) {}
    }
}
