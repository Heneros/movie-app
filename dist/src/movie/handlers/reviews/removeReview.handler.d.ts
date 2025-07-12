import { RemoveReviewCommand } from '@/movie/commands/reviews/removeReview.command';
import { ReviewRepository } from '@/movie/repositories/review.repository';
import { EventBus, ICommandHandler } from '@nestjs/cqrs';
export declare class RemoveMReviewHandler implements ICommandHandler<RemoveReviewCommand> {
    private readonly eventBus;
    private readonly reviewRepository;
    constructor(eventBus: EventBus, reviewRepository: ReviewRepository);
    execute(command: RemoveReviewCommand): Promise<string>;
}
