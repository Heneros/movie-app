import { Field, Int, ObjectType } from '@nestjs/graphql';
import { MovieReviewEntity } from './movieReview.entity';

@ObjectType()
export class ReviewPaginationEntity {
    @Field(() => [MovieReviewEntity])
    reviews: MovieReviewEntity[];

    @Field(() => Int)
    total: number;

    @Field(() => Int)
    limit: number;
}
