import { Field, InputType, Int } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

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

@InputType()
export class CreateMovieDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    @Field(() => String, { nullable: false, description: 'Title movie' })
    @Length(2, 30, { message: 'Name must be between 2 and 30 characters' })
    @ApiProperty({ required: true, description: 'Title Movie' })
    public readonly title: string;

    @IsString()
    // @IsOptional()
    @Field(() => String, {
        nullable: false,
        description: 'Description about movie',
    })
    @IsNotEmpty()
    @Length(10, 350, {
        message: 'Description must be between 10 and 350 characters',
    })
    @ApiProperty({
        required: true,
        description: 'Movie Description',
        example: 'Inception',
    })
    public readonly description: string;

    @Field(() => String, { nullable: false, description: 'Movie category' })
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        required: true,
        description: 'Movie category',
        example: 'Science Fiction',
    })
    public readonly category: string;

    // @Field(() => Int, { nullable: true, description: 'Author ID' })
    // @IsNumber()
    // @IsOptional()
    // @Type(() => Number)
    // @ApiProperty({ required: false })
    // authorId?: number;

    @Field(() => Int, { nullable: false, description: 'Year' })
    @IsNumber()

    @Type(() => Number)
    @ApiProperty({ required: false })
    year: number;

    @IsArray()
    @Field(() => [String], { nullable: false, description: 'List of actors' })
    // @ValidateNested()
    @ArrayNotEmpty({ message: 'Actors array should not be empty' })
    @IsString({ each: true })
    // @IsOptional()
    @ApiProperty({
        required: true,
        description: 'List of actors',
        example: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt'],
    })
    public readonly actorsList: string[];

    @Field(() => Boolean, {
        nullable: true,
        defaultValue: false,
        description: 'Published status',
    })
    @IsBoolean()
    @IsOptional()
    @ApiProperty({
        required: false,
        default: false,
        description: 'Movie publication status',
    })
    published?: boolean = false;
}
