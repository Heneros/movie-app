import { ApiProperty } from '@nestjs/swagger';

import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'MovieReview' })
export class MovieReviewEntity {
    @ApiProperty()
    @Field(() => String, { nullable: false })
    review: string;

    @ApiProperty()
    @Field(() => Boolean, { nullable: false })
    positive: boolean;

    @ApiProperty()
    @Field(() => String, { nullable: false })
    createdAt: Date;

    @ApiProperty()
    @Field(() => Int, { nullable: false })
    total: Number;

    constructor({ ...data }: Partial<MovieReviewEntity>) {
        Object.assign(this, data);
    }
}
