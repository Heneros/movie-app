import { MovieReviewEntity } from './movieReview.entity';
export declare class ReviewPaginationEntity {
    reviews: MovieReviewEntity[];
    total: number;
    limit: number;
}
