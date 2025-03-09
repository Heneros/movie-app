import {
    Resolver,
    Query,
    Mutation,
    Args,
    Int,
    Subscription,
} from '@nestjs/graphql';
import { MovieService } from './movie.service';
import { Movie } from './entities/movie.entity';
import { CreateMovieInput } from './dto/create-movie.input';
import { UpdateMovieInput } from './dto/update-movie.input';
import { PubSub } from 'graphql-subscriptions';

@Resolver(() => Movie)
export class MovieResolver {
    private tests: string[] = [];
    public pubSub: PubSub;
    constructor(private readonly movieService: MovieService) {
        this.pubSub = new PubSub();
    }

    @Mutation(() => Movie)
    async createMovie(@Args('createMovieInput') createMovieInput: string) {
        await this.pubSub.publish('NEW_MESSAGE', {
            newMessage: createMovieInput,
        });
        return true;
        // return this.movieService.create(createMovieInput);
    } 

    
    @Subscription((returns) => String, {
        resolve: (payload) => payload.getMsg,
    })
    getMsg() {
        console.log(123);
        return this.pubSub.asyncIterableIterator('NEW_MESSAGE');
    }

    @Query(() => [Movie], { name: 'movie' })
    findAll() {
        return this.movieService.findAll();
    }

    @Query(() => Movie, { name: 'movie' })
    findOne(@Args('id', { type: () => Int }) id: number) {
        return this.movieService.findOne(id);
    }

    @Mutation(() => Movie)
    updateMovie(@Args('updateMovieInput') updateMovieInput: UpdateMovieInput) {
        return this.movieService.update(updateMovieInput.id, updateMovieInput);
    }

    @Mutation(() => Movie)
    removeMovie(@Args('id', { type: () => Int }) id: number) {
        return this.movieService.remove(id);
    }
}
