import { CreateMovieDto } from './dto-input/create-movie.dto';
import { UpdateMovieDto } from './dto-input/update-movie.dto';
import { MovieEntity } from './entities-objectType/movie.entity';
import { User } from '@/decorators/user.decorator';
import { Movie } from '@prisma/client';
import { RateMovieDto } from './dto-input/rate-movie.dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { MovieRepository } from './repositories/movie.repository';
import { CreateMovieReviewDto } from './dto-input/create-review.dto';
import { RedisService } from '../redis/redis.service';
import { CloudinaryService } from '@/cloudinary/cloudinary.service';
import { FilterMovieDto } from './dto-input/filter-movie.dto';
export declare class MovieController {
    private readonly redisService;
    private readonly movieRepository;
    private readonly commandBus;
    private readonly queryBus;
    private readonly cloudinaryService;
    constructor(redisService: RedisService, movieRepository: MovieRepository, commandBus: CommandBus, queryBus: QueryBus, cloudinaryService: CloudinaryService);
    findAll(pageString?: string): Promise<any>;
    filterMovie(filterMovieDto: FilterMovieDto): Promise<MovieEntity[]>;
    search(searchText: string, pageString?: string): Promise<MovieEntity[]>;
    getAllReviews(pageString?: string): Promise<{
        reviews: any;
        total: any;
        page: number;
        limit: number;
    }>;
    findDrafts(pageString?: string): Promise<any>;
    findOne(id: number): Promise<MovieEntity>;
    create(createMovieDto: CreateMovieDto, user: User): Promise<MovieEntity>;
    update(id: number, updateMovieDto: UpdateMovieDto): Promise<any>;
    remove(id: number): Promise<MovieEntity>;
    addMovieFav(movieId: number, user: User): Promise<MovieEntity>;
    removeMovieFavorite(userId: number, movieId: number): Promise<MovieEntity>;
    allFavorites(userId: number, pageString?: string): Promise<MovieEntity[]>;
    rateMovie(movieId: number, user: User, rateMovieDto: RateMovieDto): Promise<Movie>;
    getReviewsByMovie(id: number, page?: number): Promise<{
        reviews: any;
        total: any;
        page: number;
        limit: number;
    }>;
    getSingleReview(id: number): Promise<any>;
    createReview(movieId: number, user: User, createMovieReviewDto: CreateMovieReviewDto): Promise<CreateMovieReviewDto>;
    updateReview(reviewId: number, userId: number, createMovieReviewDto: CreateMovieReviewDto): Promise<CreateMovieReviewDto | null>;
    removeReview(reviewId: number, userId: number): Promise<CreateMovieReviewDto | null>;
    uploadGallery(movieId: number, files: Express.Multer.File[]): "Error during upload files" | Promise<{
        images: any[];
    }>;
}
