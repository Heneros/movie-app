import { Type } from 'class-transformer';
import {
    IsIn,
    IsInt,
    IsNumber,
    IsOptional,
    IsString,
    Max,
    Min,
} from 'class-validator';

export class FilterMovieDto {
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1900)
    public year?: number;

    @IsOptional()
    @IsString()
    public category?: string;

    @IsOptional()
    @IsString()
    public director?: string;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Max(10)
    public minRating?: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Max(10)
    public avgRating?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    public maxRating?: number;

    @IsOptional()
    @IsIn(['year', 'rating', 'title'])
    public orderBy?: 'year' | 'rating' | 'title';

    @IsOptional()
    @IsIn(['asc', 'desc'])
    public order?: 'asc' | 'desc';

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(0)
    public offset?: number;
}
