export declare class MovieReviewEntity {
    id: string;
    review: string;
    positive: boolean;
    createdAt: Date;
    total: Number;
    constructor({ ...data }: Partial<MovieReviewEntity>);
}
