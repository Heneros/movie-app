import { ApiProperty } from '@nestjs/swagger';

export class CreateMovieDto {
  @ApiProperty()
  title: string;

  @ApiProperty({ required: false })
  description: string;

  @ApiProperty()
  rating: number;

  @ApiProperty()
  preview: string;

  @ApiProperty()
  category: string;

  @ApiProperty({ required: false, default: false })
  published?: boolean = false;
}
