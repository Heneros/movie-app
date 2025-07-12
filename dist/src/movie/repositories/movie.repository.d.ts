import { PrismaService } from '@/prisma/prisma.service';
import { CreateMovieDto } from '../dto-input/create-movie.dto';
import { Movie } from '@prisma/client';
import { UpdateMovieDto } from '../dto-input/update-movie.dto';
import { FilterMovieDto } from '../dto-input/filter-movie.dto';
export declare class MovieRepository {
    private prisma;
    constructor(prisma: PrismaService);
    createMovie(authorId: any, createMovieDto: CreateMovieDto): Promise<Movie>;
    findUniqueMovie(criteria: {
        id?: number;
        title?: string;
    }): Promise<{
        description: string;
        title: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        category: string;
        year: number;
        published: boolean;
        galleryId: number | null;
        previewId: number | null;
        avgRating: number;
        actorsList: string[];
        authorId: number | null;
    }>;
    findAuthorMovie(id: number): Promise<{
        description: string;
        title: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        category: string;
        year: number;
        published: boolean;
        galleryId: number | null;
        previewId: number | null;
        avgRating: number;
        actorsList: string[];
        authorId: number | null;
    }[]>;
    findMovieUniqueWithAuthor(userId: number, movieId?: number): Promise<boolean>;
    addMovieFavWithAuthor(movieId: number, userId: number): Promise<{
        movieId: number;
        userId: number;
    }>;
    findManyInFav(userId: number, skip: number, movieId?: number): Promise<{
        movieId: number;
        userId: number;
    }[]>;
    findManyMovieIn(skip: number, movieIds: number[]): Promise<{
        description: string;
        title: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        category: string;
        year: number;
        published: boolean;
        galleryId: number | null;
        previewId: number | null;
        avgRating: number;
        actorsList: string[];
        authorId: number | null;
    }[]>;
    findUniqueFavMov(userId: any, movieId: any): Promise<{
        movieId: number;
        userId: number;
    }>;
    removeFromFav(movieId: number, userId: number): Promise<{
        movieId: number;
        userId: number;
    }>;
    updateMovie(criteria: {
        id: number;
        avg?: number;
        updateMovieDto?: UpdateMovieDto;
    }): Promise<{
        description: string;
        title: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        category: string;
        year: number;
        published: boolean;
        galleryId: number | null;
        previewId: number | null;
        avgRating: number;
        actorsList: string[];
        authorId: number | null;
    }>;
    findAllMovie(skip: number): Promise<{
        description: string;
        title: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        category: string;
        year: number;
        published: boolean;
        galleryId: number | null;
        previewId: number | null;
        avgRating: number;
        actorsList: string[];
        authorId: number | null;
    }[]>;
    findAllDraftsMovie(skip: number): Promise<{
        description: string;
        title: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        category: string;
        year: number;
        published: boolean;
        galleryId: number | null;
        previewId: number | null;
        avgRating: number;
        actorsList: string[];
        authorId: number | null;
    }[]>;
    findUniqueRating(movieId: number, userId: number): Promise<{
        id: number;
        movieId: number;
        userId: number;
        value: number;
    }>;
    updateRating(id: number, value: number): Promise<{
        id: number;
        movieId: number;
        userId: number;
        value: number;
    }>;
    createRating(movieId: number, userId: number, value: number): Promise<{
        id: number;
        movieId: number;
        userId: number;
        value: number;
    }>;
    getAllRatingsForMovie(movieId: number): Promise<{
        value: number;
    }[]>;
    searchMovie(searchText: string, skip: number): Promise<{
        description: string;
        title: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        category: string;
        year: number;
        published: boolean;
        galleryId: number | null;
        previewId: number | null;
        avgRating: number;
        actorsList: string[];
        authorId: number | null;
    }[]>;
    removeMovie(id: number): Promise<[import(".prisma/client").Prisma.BatchPayload, import(".prisma/client").Prisma.BatchPayload, {
        description: string;
        title: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        category: string;
        year: number;
        published: boolean;
        galleryId: number | null;
        previewId: number | null;
        avgRating: number;
        actorsList: string[];
        authorId: number | null;
    }]>;
    filterMovie(filterMovieDto: FilterMovieDto): Promise<{
        description: string;
        title: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        category: string;
        year: number;
        published: boolean;
        galleryId: number | null;
        previewId: number | null;
        avgRating: number;
        actorsList: string[];
        authorId: number | null;
    }[]>;
}
