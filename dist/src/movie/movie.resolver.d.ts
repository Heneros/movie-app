import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { MovieEntity } from './entities-objectType/movie.entity';
import { User } from '@/decorators/user.decorator';
import { MovieBasicInput } from './input/movie.input';
import { PubSub } from 'graphql-subscriptions';
import { MovieRepository } from '@/movie/repositories/movie.repository';
import { CreateMovieReviewDto } from './dto-input/create-review.dto';
import { CreateMovieDto } from './dto-input/create-movie.dto';
export declare class MovieResolver {
    private readonly movieRepository;
    private readonly commandBus;
    private readonly queryBus;
    pubSub: PubSub;
    constructor(movieRepository: MovieRepository, commandBus: CommandBus, queryBus: QueryBus);
    movieRatingUpdated(): Promise<import("graphql-subscriptions/dist/pubsub-async-iterable-iterator").PubSubAsyncIterableIterator<unknown>>;
    createMovie(user: User, createMovieDto: CreateMovieDto): Promise<MovieEntity>;
    updateMovie(id: number, updateMovieDto: CreateMovieDto): Promise<any>;
    addToFavorite(movieId: number, user: User): Promise<MovieEntity>;
    getAllFavorites(userId: number, pageNum?: number): Promise<MovieEntity[]>;
    removeFromFavorite(movieBasicInput: MovieBasicInput): Promise<MovieEntity>;
    getAllMovies(page: number): Promise<MovieEntity[]>;
    searchMovies(title: string, pageString?: string): Promise<any>;
    findDrafts(pageString?: string): Promise<any>;
    findOne(id: number): Promise<MovieEntity>;
    rateMovie(movieId: number, value: number, user: User): Promise<any>;
    getAllReviews(pageString: string): Promise<{
        reviews: any;
        total: any;
        limit: number;
    }>;
    getReviewsByMovie(id: number, page: number): Promise<{
        reviews: any;
        total: any;
        limit: number;
    }>;
    getReviewSingleByMovie(id: number): Promise<any>;
    createReview(movieId: number, userId: number, createMovieReviewDto: CreateMovieReviewDto): Promise<any>;
    updateReview(reviewId: number, userId: number, createMovieReviewDto: CreateMovieReviewDto): Promise<CreateMovieReviewDto>;
    removeMovie(id: number): Promise<MovieEntity>;
    removeReview(reviewId: number, userId: number): Promise<CreateMovieReviewDto>;
}
