import {
    Args,
    Int,
    Mutation,
    Parent,
    Query,
    ResolveField,
    Resolver,
    Subscription,
} from '@nestjs/graphql';
import { NotFoundException, UseGuards } from '@nestjs/common';

import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { MovieEntity } from './entities-objectType/movie.entity';
import { AuthGuard } from '@/guards/auth.guard';

import { ProfileOwnerGuard } from '@/guards/ProfileOwner.guard';
import { PAGINATION_LIMIT } from '@/data/defaultData';
import { CheckMovieExistPipe } from './guard/checkIfMovieExist.guard';
import { User } from '@/decorators/user.decorator';
import { MovieBasicInput } from './input/movie.input';
import { PubSub } from 'graphql-subscriptions';
import { MovieRepository } from '@/movie/repositories/movie.repository';
import { AddMovieFavCommand } from './commands/favorite/addMovieFavorite.command';
import { GetAllFavoritesQuery } from './queries/favorite/getAllFavorite.query';
import { FindDraftsMovieQuery } from './queries/findDrafts.query';
import { Roles } from '@/decorators/roles.decorator';
import { RateMovieCommand } from './commands/rateMovie.command';
import { FindOneMovieQuery } from './queries/findOneMovie.query';
import { RemoveMovieFavCommand } from './commands/favorite/removeMovieFavorite.command';
import { FindAllMovieQuery } from './queries/findAllMovie.query';
import { SearchMovieQuery } from './queries/searchMovie.query';
import { GetReviewsQuery } from './queries/reviews/getAllReviews.query';
import { ReviewPaginationEntity } from './entities-objectType/reviewPaginationEntity.entity';
import { GetReviewsByMovieQuery } from './queries/reviews/getAllReviewsMovie.query';
import { GetSingleReviewQuery } from './queries/reviews/getSingleReview.query';
import { MovieReviewEntity } from './entities-objectType/movieReview.entity';
import { CreateReviewCommand } from './commands/reviews/createReview.command';
import { CreateMovieReviewDto } from './dto-input/create-review.dto';
import { UpdateReviewCommand } from './commands/reviews/updateReview.command';
import { RemoveReviewCommand } from './commands/reviews/removeReview.command';
import { RemoveMovieCommand } from './commands/removeMovie.command';
import { CreateMovieDto } from './dto-input/create-movie.dto';
import { CreateMovieCommand } from './commands/createMovie.command';
import { UpdateMovieCommand } from './commands/updateMovie.command';
import { UpdateMovieDto } from './dto-input/update-movie.dto';
import { UserEntity } from '@/users/entities-objectType/user.entity';
import { Movie } from '@prisma/client';
import { FindAuthorMovieQuery } from './queries/findAuthorMovie.query';
import { GetIdUserQuery } from '@/users/queries';

@Resolver((of) => MovieEntity)
export class MovieResolver {
    public pubSub: PubSub;
    constructor(
        private readonly movieRepository: MovieRepository,
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,

        // @Inject('PUB_SUB') private pubSub: PubSubEngine,
    ) {
        this.pubSub = new PubSub();
    }

    // @Query(() => [MovieEntity], {
    //     description: 'Author',
    // })
    // async findAuthor(@Args('id') id: number) {
    //     console.log(id);
    //     const result = await this.queryBus.execute(
    //         new FindAuthorMovieQuery(id),
    //     );
    //     return result;
    // }

    @Subscription(() => MovieEntity, {
        name: 'movieRatingUpdated',
        resolve: (payload) => {
            return payload.movieRatingUpdated;
        },
    })
    async movieRatingUpdated() {
        // console.log('test', 333);
        return this.pubSub.asyncIterableIterator('MOVIE_RATING_UPDATED');
    }

    @UseGuards(AuthGuard)
    @Mutation(() => MovieEntity, {
        description: 'Create Movie',
    })
    async createMovie(
        @User('id') user: User,
        @Args('input') createMovieDto: CreateMovieDto,
    ) {
        await this.pubSub.publish('NEW_MESSAGE', {
            newMessage: createMovieDto,
        });
        createMovieDto.authorId = user.id;

        const movie = await this.commandBus.execute(
            new CreateMovieCommand(createMovieDto),
        );
        return new MovieEntity(movie);
    }

    @UseGuards(AuthGuard)
    @Mutation(() => MovieEntity, {
        description: 'Update Movie',
    })
    async updateMovie(
        @Args('id') id: number,
        @Args('input') updateMovieDto: CreateMovieDto,
    ) {
        return await this.commandBus.execute(
            new UpdateMovieCommand(id, updateMovieDto),
        );
    }

    @UseGuards(AuthGuard, ProfileOwnerGuard)
    @Mutation((returns) => MovieEntity, {
        description: 'Add to favorite list',
    })
    async addToFavorite(
        @Args('movieId', CheckMovieExistPipe) movieId: number,
        // @Args('userId') userId: number,
        @User('userId') user: User,
    ) {
        return new MovieEntity(
            await this.commandBus.execute(
                new AddMovieFavCommand(movieId, user.id),
            ),
        );
    }

    @UseGuards(AuthGuard, ProfileOwnerGuard)
    @Query((returns) => [MovieEntity], { description: 'Get All favorites ' })
    async getAllFavorites(
        @Args('userId', { type: () => Int }) userId: number,
        @Args('page', { type: () => Number, defaultValue: 1, nullable: true })
        pageNum?: number,
    ): Promise<MovieEntity[]> {
        const page = pageNum ? Number(pageNum) : 1;
        const skip = (page - 1) * PAGINATION_LIMIT;
        // const userId = user.id;
        // console.log(userId);
        const favoriteMovies = await this.queryBus.execute(
            new GetAllFavoritesQuery(userId, skip),
        );

        // return favoriteMovies;
        const movieIds = favoriteMovies.map((fav) => fav.movieId);

        const movies = await this.movieRepository.findManyMovieIn(
            skip,
            movieIds,
        );

        return movies.map((movie) => new MovieEntity(movie));
    }

    @UseGuards(AuthGuard, ProfileOwnerGuard)
    @Mutation((returns) => MovieEntity, {
        description: 'Remove from favorites',
    })
    async removeFromFavorite(
        @Args('input') movieBasicInput: MovieBasicInput,
    ): Promise<MovieEntity> {
        const { movieId, userId } = movieBasicInput;
        if (!movieId || !userId) {
            throw new NotFoundException(
                `Problem: movieId (${movieId}) or userId (${userId}) is missing.`,
            );
        }
        // console.log(12231312);
        const movie = await this.queryBus.execute(
            new FindOneMovieQuery(movieId),
        );

        if (!movie) {
            throw new NotFoundException(
                `movie with ${movieId} does not exist.`,
            );
        }

        await this.commandBus.execute(
            new RemoveMovieFavCommand(movieId, userId),
        );
        // await this.movieFavorite.removeMovieFav(movieId, userId);
        return new MovieEntity(movie);
    }

    @Query(() => [MovieEntity], { description: 'Get All movies' })
    async getAllMovies(
        @Args('page', { type: () => Number, defaultValue: 1, nullable: true })
        page: number,
    ): Promise<MovieEntity[]> {
        const currentPage = page ?? 1;
        const skip = (currentPage - 1) * PAGINATION_LIMIT;

        // const movies = (await this.movieFindAllService.findAll(
        //     skip,
        // )) as Movie[];
        const movies = await this.queryBus.execute(new FindAllMovieQuery(skip));

        return movies.allMovies.map((movie) => new MovieEntity(movie));
    }

    @Query(() => [MovieEntity], { description: 'Search movies' })
    async searchMovies(
        @Args('title', { type: () => String }) title: string,
        @Args('pageString', { type: () => Number, nullable: true })
        pageString?: string,
    ) {
        const page = pageString ? parseInt(pageString, 10) : 1;
        const skip = (page - 1) * PAGINATION_LIMIT;

        // const movies = await this.movieSearchService.searchByTitle(title, skip);
        const movies = await this.queryBus.execute(
            new SearchMovieQuery(title, skip),
        );

        if (!movies || movies.length === 0) {
            throw new NotFoundException(
                `Movies with title '${title}' do not exist.`,
            );
        }

        return movies.map((movie) => new MovieEntity(movie));
    }

    @UseGuards(AuthGuard)
    @Roles('Admin', 'Editor')
    @Query(() => [MovieEntity], { description: 'Get Drafts movies' })
    async findDrafts(
        @Args('page', { type: () => String }) pageString?: string,
    ) {
        const page = pageString ? parseInt(pageString, 10) : 1;
        const skip = (page - 1) * PAGINATION_LIMIT;

        // const drafts = (await this.movieFindDraftsService.findDrafts(
        //     skip,
        // )) as Movie[];
        const movies = await this.queryBus.execute(
            new FindDraftsMovieQuery(skip),
        );

        return movies.map((draft) => new MovieEntity(draft));
    }

    @Query(() => MovieEntity, { description: 'Find By id movie' })
    async findOne(
        @Args(
            'id',
            { type: () => Number, nullable: false },
            CheckMovieExistPipe,
        )
        id: number,
    ) {
        const movie = await this.queryBus.execute(new FindOneMovieQuery(id));

        return new MovieEntity(movie);
    }

    @UseGuards(AuthGuard)
    @Mutation(() => MovieEntity, { description: 'Rate movie' })
    async rateMovie(
        @Args('id', { nullable: false }, CheckMovieExistPipe)
        movieId: number,
        @Args('rating', { nullable: false })
        value: number,
        @User('id')
        user: User,
    ) {
        const movie = await this.commandBus.execute(
            new RateMovieCommand(movieId, user.id, value),
        );

        this.pubSub.publish('MOVIE_RATING_UPDATED', {
            movieRatingUpdated: movie,
        });
        // console.log(movie, 123);
        return movie;
    }

    @Query(() => ReviewPaginationEntity, {
        description: 'Get All Reviews from app',
    })
    async getAllReviews(
        @Args('page', { type: () => String, nullable: true })
        pageString: string,
    ) {
        const page = pageString ? parseInt(pageString, 10) : 1;
        const skip = (page - 1) * PAGINATION_LIMIT;

        const { reviews, total } = await this.queryBus.execute(
            new GetReviewsQuery(skip),
        );
        if (!reviews || reviews.length === 0) {
            throw new NotFoundException(`Not Exist`);
        }

        return { reviews, total, limit: PAGINATION_LIMIT };
        // return { reviews, total, page, limit: PAGINATION_LIMIT };
    }

    @Query(() => ReviewPaginationEntity, {
        description: 'Get All Reviews from movie',
    })
    async getReviewsByMovie(
        @Args('id', { type: () => Number, nullable: false })
        id: number,
        @Args('page', { type: () => Number, nullable: false })
        page: number,
    ) {
        const { reviews, total } = await this.queryBus.execute(
            new GetReviewsByMovieQuery(id, page),
        );

        return { reviews, total, limit: PAGINATION_LIMIT };
        // return { reviews, total, page, limit: PAGINATION_LIMIT };
    }

    @Query(() => MovieReviewEntity, {
        description: 'Get single review from movie',
    })
    async getReviewSingleByMovie(
        @Args('id', { type: () => Number, nullable: false })
        id: number,
    ) {
        const review = await this.queryBus.execute(
            new GetSingleReviewQuery(id),
        );

        return review;
    }

    @UseGuards(AuthGuard)
    @Mutation(() => MovieReviewEntity, {
        description: 'Create a review for a movie',
    })
    async createReview(
        @Args('movieId', { type: () => Number, nullable: false })
        movieId: number,
        @Args('userId') userId: number,
        @Args('input') createMovieReviewDto: CreateMovieReviewDto,
    ) {
        const newReview = await this.commandBus.execute(
            new CreateReviewCommand(movieId, userId, createMovieReviewDto),
        );
        return newReview;
    }

    @UseGuards(AuthGuard, ProfileOwnerGuard)
    @Mutation(() => MovieReviewEntity, {
        description: 'Update review movie. You can edit during 15 minutes',
    })
    async updateReview(
        @Args('reviewId', { type: () => Number, nullable: false })
        reviewId: number,
        @Args('userId') userId: number,
        @Args('input') createMovieReviewDto: CreateMovieReviewDto,
    ): Promise<CreateMovieReviewDto> {
        const newReview = await this.commandBus.execute(
            new UpdateReviewCommand(reviewId, userId, createMovieReviewDto),
        );
        return newReview;
    }

    @Roles('Admin', 'Editor')
    @UseGuards(AuthGuard)
    @Mutation(() => MovieEntity, {
        description: '',
    })
    async removeMovie(
        @Args(
            'movieId',
            {
                type: () => Number,
                nullable: false,
            },
            CheckMovieExistPipe,
        )
        id: number,
    ): Promise<MovieEntity> {
        const movie = await this.queryBus.execute(new FindOneMovieQuery(id));
        if (!movie) {
            throw new NotFoundException(`movie with ${id} does not exist.`);
        }

        await this.commandBus.execute(new RemoveMovieCommand(id));

        return new MovieEntity(movie);
    }

    @UseGuards(AuthGuard, ProfileOwnerGuard)
    @Mutation(() => MovieReviewEntity, {
        description: 'Delete review movie',
    })
    async removeReview(
        @Args('reviewId', { type: () => Number, nullable: false })
        reviewId: number,
        @Args('userId') userId: number,
    ): Promise<CreateMovieReviewDto> {
        const newReview = await this.commandBus.execute(
            new RemoveReviewCommand(reviewId, userId),
        );
        return newReview;
    }
}
