import { CreateReviewCommand } from '@/movie/commands/reviews/createReview.command';

import { CommandHandler, EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { RedisService } from '@/redis/redis.service';
import { CreatedReviewEvent } from '@/movie/events/createReview.event';

@EventsHandler(CreatedReviewEvent)
export class CreatedMovieReviewHandler
    implements IEventHandler<CreatedReviewEvent>
{
    constructor(
        // private readonly eventStore: EventStrore
        private readonly redisService: RedisService,
    ) {}

    async handle(event: CreatedReviewEvent) {
        // const { movieId, auId, createMovieReviewDto } = event;
        // console.log('Movie added event received:', event);
        // await this.redisService.saveEvent('movie_events', {
        //     type: 'MovieAdded',
        //     data: event,
        //     timestamp: new Date().toISOString(),
        // });
    }
}
