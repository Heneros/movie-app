import { CreateMovieReviewDto } from '@/movie/dto-input/create-review.dto';
import { IEvent } from '@nestjs/cqrs';
export declare class CreatedReviewEvent implements IEvent {
    readonly movieId: number;
    readonly auId: number;
    readonly createMovieReviewDto: CreateMovieReviewDto;
    constructor(movieId: number, auId: number, createMovieReviewDto: CreateMovieReviewDto);
}
