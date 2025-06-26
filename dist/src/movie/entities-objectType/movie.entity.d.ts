import { Movie } from '@prisma/client';
import { UpdateUserDto } from '@/users/dto-input/update-user.dto';
export declare class MovieEntity implements Movie {
    id: number;
    title: string;
    description: string;
    category: string;
    preview: string;
    published: boolean;
    createdAt: Date;
    updatedAt: Date;
    authorId: number;
    previewId: number;
    author: UpdateUserDto;
    actorsList: string[];
    movieId?: number;
    userId: number;
    galleryId: number;
    avgRating: number;
    year: number;
    constructor({ author, ...data }: Partial<MovieEntity>);
}
