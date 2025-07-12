import { UpdateReviewCommand } from '@/movie/commands/reviews/updateReview.command';
import { ReviewRepository } from '@/movie/repositories/review.repository';
import { ICommandHandler } from '@nestjs/cqrs';
import { Reviews } from '@prisma/client';
export declare class UpdateReviewHandler implements ICommandHandler<UpdateReviewCommand> {
    private readonly reviewRepository;
    constructor(reviewRepository: ReviewRepository);
    execute(command: UpdateReviewCommand): Promise<Reviews | null>;
}
