import { RemoveReviewCommand } from '@/movie/commands/reviews/removeReview.command';
import { ReviewRepository } from '@/movie/repositories/review.repository';
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
        // const { movieId, auId } = command;


    }
}
