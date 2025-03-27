import { PrismaService } from '@/prisma/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMovieDto } from '../dto/create-movie.dto';
import { Movie } from '@prisma/client';
import { PAGINATION_LIMIT } from '@/data/defaultData';
import { UpdateMovieDto } from '../dto/update-movie.dto';

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

    async findUniqueMovie(criteria: { id?: number; title?: string }) {
        const { id, title } = criteria;
        const movie = await this.prisma.movie.findUnique({
            where: {
                ...(id && { id }),
                ...(title && { title }),
            },
            // include: {
            //     author: true,
            // },
        });
        return movie;
    }

    async findMovieUniqueWithAuthor(userId: number, movieId?: number) {
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

    async findManyInFav(userId: number, skip: number, movieId?: number) {
        // console.log(movieId, userId);
        return await this.prisma.userFavoriteMovies.findMany({
            skip,
            take: PAGINATION_LIMIT,
            where: {
                userId: userId,
                movieId: movieId,
            },
        });
    }

    async findManyMovieIn(skip: number, movieIds: number[]) {
        return await this.prisma.movie.findMany({
            skip,
            take: PAGINATION_LIMIT,
            where: {
                id: { in: movieIds },
            },
        });
    }

    async findUniqueFavMov(userId, movieId) {
        return await this.prisma.userFavoriteMovies.findUnique({
            where: {
                userId_movieId: {
                    userId,
                    movieId,
                },
            },
        });
        // return movie;
    }
    async removeFromFav(movieId: number, userId: number) {
        const favorite = await this.prisma.userFavoriteMovies.findUnique({
            where: {
                userId_movieId: { movieId, userId },
            },
        });

        if (!favorite) {
            throw new NotFoundException(
                `Movie with ID ${movieId} is not in the favorites of user ${userId}.`,
            );
        }

        return await this.prisma.userFavoriteMovies.delete({
            where: {
                userId_movieId: { movieId, userId },
            },
        });
    }

    async updateMovie(criteria: {
        id: number;
        avg?: number;
        updateMovieDto?: UpdateMovieDto;
    }) {
        const { id, updateMovieDto, avg } = criteria;
        // console.log('id, updateMovieDto, avg', id, avg);
        return await this.prisma.movie.update({
            where: { id },
            data: {
                ...(updateMovieDto || {}),
                ...(avg !== undefined ? { avgRating: avg } : {}),
            },
        });
    }

    async findAllMovie(skip: number) {
        return await this.prisma.movie.findMany({
            skip,
            take: PAGINATION_LIMIT,
            orderBy: {
                id: 'asc',
            },
        });
    }

    async findAllDraftsMovie(skip: number) {
        return await this.prisma.movie.findMany({
            skip,
            where: { published: false },
            take: PAGINATION_LIMIT,
            orderBy: {
                id: 'asc',
            },
        });
    }

    async findUniqueRating(movieId: number, userId: number) {
        return await this.prisma.rating.findUnique({
            where: {
                userId_movieId: { movieId, userId },
            },
        });
    }

    async updateRating(id: number, value: number) {
        return this.prisma.rating.update({
            where: { id },
            data: { value },
        });
    }
    async createRating(movieId: number, userId: number, value: number) {
        const movieExists = await this.prisma.movie.findUnique({
            where: { id: movieId },
            select: { id: true },
        });

        if (!movieExists) {
            throw new NotFoundException(`Movie with ID ${movieId} not found.`);
        }

        return this.prisma.rating.create({
            data: {
                value,
                user: { connect: { id: userId } },
                movie: { connect: { id: movieId } },
            },
        });
    }

    async getAllRatingsForMovie(movieId: number) {
        return this.prisma.rating.findMany({
            where: { movieId },
            select: { value: true },
        });
    }

    async searchMovie(searchText: string, skip: number) {
        return await this.prisma.movie.findMany({
            skip,
            take: PAGINATION_LIMIT,
            where: {
                title: {
                    contains: searchText,
                    mode: 'insensitive',
                },
            },
        });
    }
    async removeMovie(id: number) {
        const movie = Promise.all([
            this.prisma.reviews.deleteMany({ where: { movieId: id } }),
            this.prisma.rating.deleteMany({ where: { movieId: id } }),
            this.prisma.movie.delete({ where: { id } }),
        ]);
        return movie;
    }
}
