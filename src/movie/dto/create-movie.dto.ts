import { ApiProperty } from '@nestjs/swagger';

import {
  IsBoolean,
  IsNotEmpty,
  IsInt,
  IsOptional,
  IsString,
  MinLength,
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

  @IsInt()
  @IsNotEmpty()
  @ApiProperty()
  rating: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  preview: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  category: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ required: false, default: false })
  published?: boolean = false;
}
