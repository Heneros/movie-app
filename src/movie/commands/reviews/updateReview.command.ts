import { ICommand } from '@nestjs/cqrs';
import { CreateMovieReviewDto } from '@/movie/dto-input/create-review.dto';

export class UpdateReviewCommand implements ICommand {
    constructor(
        public readonly reviewId: number,
        public readonly auId: number,
        public readonly createMovieReviewDto: CreateMovieReviewDto,
    ) {}
}
