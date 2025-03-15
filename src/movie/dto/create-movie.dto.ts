import { ApiProperty } from '@nestjs/swagger';

import {
    IsBoolean,
    IsNotEmpty,
    IsInt,
    IsOptional,
    IsString,
    MinLength,
    IsNumber,
    MaxLength,
    IsArray,
    Length,
    ValidateNested,
    ArrayNotEmpty,
} from 'class-validator';

export class CreateMovieDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    @Length(2, 30, { message: 'Name must be between 2 and 30 characters' })
    @ApiProperty({ required: true, description: 'Title Movie' })
    public readonly title: string;

    @IsString()
    // @IsOptional()
    @IsNotEmpty()
    @Length(10, 350, {
        message: 'Description must be between 10 and 350 characters',
    })
    @ApiProperty({ required: false })
    public readonly description: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    public readonly preview: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: 'Category Movie' })
    public readonly category: string;

    @IsNumber()
    @IsOptional()
    @ApiProperty({ required: false })
    authorId: number;

    @IsArray()
    // @ValidateNested()
    @ArrayNotEmpty({ message: 'Actors array should not be empty' })
    @IsString({ each: true })
    // @IsOptional()
    @ApiProperty({ required: false })
    public readonly actorsList: string[];

    @IsBoolean()
    @IsOptional()
    @ApiProperty({ required: false, default: false })
    published: boolean = false;
}
