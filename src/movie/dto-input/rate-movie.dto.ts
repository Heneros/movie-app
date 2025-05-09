import { Expose, Transform } from 'class-transformer';
import { IsInt, Max, Min } from 'class-validator';
import { MovieEntity } from '../entities-objectType/movie.entity';

export class RateMovieDto {
    @IsInt()
    @Min(1)
    @Max(10)
    rating: number;
}
