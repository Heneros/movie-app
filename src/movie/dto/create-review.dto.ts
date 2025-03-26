import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateMovieReviewDto {
    @IsString()
    @IsNotEmpty()
    @Field(() => String, { nullable: false, description: 'Review movie' })
    @ApiProperty({ required: true, description: 'Review movie' })
    public readonly review: string;

    @IsBoolean()
    @Field(() => Boolean, {
        nullable: false,
        description: 'Positive or negative',
    })
    @ApiProperty({ required: true, description: 'Positive or not' })
    public readonly positive: boolean = true;
}
