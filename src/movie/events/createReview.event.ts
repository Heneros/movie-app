import { CreateMovieReviewDto } from '@/movie/dto/create-review.dto';
import { IEvent } from '@nestjs/cqrs';

export class CreatedReviewEvent implements IEvent {
    constructor(
        public readonly movieId: number,
        public readonly auId: number,
        public readonly createMovieReviewDto: CreateMovieReviewDto,
    ) {}
}
