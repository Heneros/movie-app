export declare class FilterMovieDto {
    year?: number;
    category?: string;
    director?: string;
    minRating?: number;
    avgRating?: number;
    maxRating?: number;
    orderBy?: 'year' | 'rating' | 'title';
    order?: 'asc' | 'desc';
    offset?: number;
}
