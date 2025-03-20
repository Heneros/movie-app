import { CreateReviewCommand } from '@/movie/commands/reviews/createReview.command';
import { CreatedReviewEvent } from '@/movie/events/createReview.event';
import { MovieRepository } from '@/movie/repositories/movie.repository';
import { ReviewRepository } from '@/movie/repositories/review.repository';
import { BadRequestException } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(CreateReviewCommand)
export class CreateMovieReviewHandler
    implements ICommandHandler<CreateReviewCommand>
{
    constructor(
        private readonly eventBus: EventBus,
        private readonly reviewRepository: ReviewRepository,
    ) {}

    async execute(command: CreateReviewCommand) {
        const { movieId, auId, createMovieReviewDto } = command;

        const review = await this.reviewRepository.findByIdAndAuthor(
            movieId,
            auId,
        );

        if (review) {
            throw new BadRequestException('You already reviewed this movie.');
        }

        const newReview = await this.reviewRepository.createReview(
            movieId,
            auId,
            createMovieReviewDto,
        );

        this.eventBus.publish(
            new CreatedReviewEvent(movieId, auId, createMovieReviewDto),
        );

        return newReview;
    }
}
