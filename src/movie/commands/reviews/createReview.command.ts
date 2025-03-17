import { ICommand } from '@nestjs/cqrs';
import { CreateMovieReviewDto } from '@/movie/dto/create-review.dto';

export class CreateReviewCommand implements ICommand {
    constructor(
        public readonly movieId: number,
        public readonly auId: number,
        public readonly createMovieReviewDto: CreateMovieReviewDto,
    ) {}
}
