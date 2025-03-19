import { ApiProperty } from '@nestjs/swagger';

import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateMovieReviewDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ required: true, description: 'Review movie' })
    public readonly review: string;

    @IsBoolean()
    @ApiProperty({ required: true, description: 'Positive or not' })
    public readonly positive: boolean = true;
}
