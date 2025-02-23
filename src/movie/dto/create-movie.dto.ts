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
} from 'class-validator';

export class CreateMovieDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @ApiProperty()
  title: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ required: false })
  description: string;

  // @IsInt()
  // @IsNotEmpty()
  // @MaxLength(1)
  // @MaxLength(10)
  // @ApiProperty()
  // rating: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  preview: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  category: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ required: false })
  authorId: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @ApiProperty({ required: false })
  actorsList: string[];

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ required: false, default: false })
  published?: boolean = false;
}
