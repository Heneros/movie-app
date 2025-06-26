import { ICommand } from '@nestjs/cqrs';
export declare class RemoveReviewCommand implements ICommand {
    readonly reviewId: number;
    readonly userId: number;
    constructor(reviewId: number, userId: number);
}
