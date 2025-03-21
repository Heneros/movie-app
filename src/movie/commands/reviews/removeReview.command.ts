import { ICommand } from '@nestjs/cqrs';

export class RemoveReviewCommand implements ICommand {
    constructor(
        public readonly reviewId: number,
        public readonly auId: number,
    ) {}
}
