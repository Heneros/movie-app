import { ICommand } from '@nestjs/cqrs';
import { CreateMovieReviewDto } from '@/movie/dto-input/create-review.dto';
export declare class UpdateReviewCommand implements ICommand {
    readonly reviewId: number;
    readonly userId: number;
    readonly createMovieReviewDto: CreateMovieReviewDto;
    constructor(reviewId: number, userId: number, createMovieReviewDto: CreateMovieReviewDto);
}
