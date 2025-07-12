import { CreateReviewCommand } from '@/movie/commands/reviews/createReview.command';
import { ReviewRepository } from '@/movie/repositories/review.repository';
import { EventBus, ICommandHandler } from '@nestjs/cqrs';
export declare class CreateMovieReviewHandler implements ICommandHandler<CreateReviewCommand> {
    private readonly eventBus;
    private readonly reviewRepository;
    constructor(eventBus: EventBus, reviewRepository: ReviewRepository);
    execute(command: CreateReviewCommand): Promise<{
        id: number;
        createdAt: Date;
        movieId: number;
        review: string;
        positive: boolean;
        auId: number;
    }>;
}
