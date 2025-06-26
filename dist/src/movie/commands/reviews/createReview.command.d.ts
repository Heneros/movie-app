import { ICommand } from '@nestjs/cqrs';
import { CreateMovieReviewDto } from '@/movie/dto-input/create-review.dto';
export declare class CreateReviewCommand implements ICommand {
    readonly movieId: number;
    readonly auId: number;
    readonly createMovieReviewDto: CreateMovieReviewDto;
    constructor(movieId: number, auId: number, createMovieReviewDto: CreateMovieReviewDto);
}
