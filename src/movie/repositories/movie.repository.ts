import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateMovieDto } from '../dto/create-movie.dto';
import { Movie } from '@prisma/client';
import { PAGINATION_LIMIT } from '@/data/defaultData';

@Injectable()
export class MovieRepository {
    constructor(private prisma: PrismaService) {}

    async createMovie(createMovieDto: CreateMovieDto): Promise<Movie> {
        return this.prisma.movie.create({
            data: {
                ...createMovieDto,
            },
        });
    }

    async findUniqueMovie(criteria: {
        id?: number;
        title?: string;
    }): Promise<boolean> {
        const { id, title } = criteria;
        const movie = await this.prisma.movie.findUnique({
            where: {
                ...(id && { id }),
                ...(title && { title }),
            },
            include: {
                author: true,
            },
        });
        return !!movie;
    }

    async findMovieUniqueWithAuthor(userId: number, movieId: number) {
        const favorite = await this.prisma.userFavoriteMovies.findUnique({
            where: {
                userId_movieId: {
                    userId: userId,
                    movieId: movieId,
                },
            },
        });

        return !!favorite;
    }
    async addMovieFavWithAuthor(movieId: number, userId: number) {
        return this.prisma.userFavoriteMovies.create({
            data: { movieId, userId },
        });
    }

    async findManyInFav(userId: number, skip: number) {
        // console.log('user.id, skip test', userId, skip);
        return await this.prisma.userFavoriteMovies.findMany({
            skip,
            take: PAGINATION_LIMIT,

            where: { userId: userId },
        });
    }

    async findManyMovieIn(skip: number, movieIds: number[]) {
        // console.log('user.id, skip test', userId, skip);
        return await this.prisma.movie.findMany({
            skip,
            take: PAGINATION_LIMIT,
            where: {
                id: { in: movieIds },
            },
        });
    }

    async removeFromFav(movieId: number, userId: number) {
        // console.log('user.id, skip test', userId, skip);
        return await this.prisma.userFavoriteMovies.delete({
            where: {
                userId_movieId: { movieId, userId },
            },
        });
    }
}
