import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, RedisClientType } from 'redis';
import { Observable } from 'rxjs';
import { RedisClient } from './redis.client';

export interface IRedisSubscribeMessage {
    readonly message: string;
    readonly channel: string;
}

const REDIS_EXPIRE_TIME = 7 * 24 * 60 * 60;

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
    private client: RedisClientType;

    constructor() { // private readonly client: RedisClient, // private readonly config: ConfigService,
        this.client = createClient({
            url: 'redis://localhost:6379',
        });

        this.client.on('error', (err) => {
            console.error('Redis connection error:', err);
        });
    }

    async onModuleInit() {
        try {
            await this.client.connect();
            console.log(' Connected to Redis');
        } catch (err) {
            console.error(' Failed to connect to Redis:', err);
        }
    }

    async onModuleDestroy() {
        await this.client.disconnect();
    }

    async isConnected(): Promise<boolean> {
        return this.client.isReady;
    }
    async saveEvent(stream: string, event: any) {
        try {
            if (!(await this.isConnected())) {
                console.error('Redis is not connected');
                return;
            }

            const eventData = JSON.stringify(event);

            await this.client.xAdd(stream, '*', { eventData });

            console.log(`✅ Event saved to stream: ${stream}`);
        } catch (error) {
            console.error('Error saving event:', error);
        }
    }

    // public get pub_client() {
    //     return this.client.pub;
    // }

    // public get sub_client() {
    //     return this.client.sub;
    // }

    async getEvents(stream: string) {
        try {
            if (!(await this.isConnected())) {
                console.error('Redis is not connected');
                return [];
            }

            const events = await this.client.xRange(stream, '-', '+');

            if (!events.length) {
                console.log(`ℹ️ No events found in stream: ${stream}`);
                return [];
            }

            return events;
        } catch (error) {
            console.error('Error fetching events:', error);
            return [];
        }
    }

    // public fromEvent<T>(event_name: string): Observable<T> {
    //     const REDIS_KEY = this.config.getOrThrow<string>('REDIS_KEY');

    //     const key = `${REDIS_KEY}_${event_name}`;

    //     this.client.subscribe(key);

    //     return this.client.events$.pipe(
    //         filter(({ channel }) => channel === key),
    //         map(({ message }) => JSON.parse(message)),
    //         filter((message) => message.redis_id !== this.id),
    //     );
    // }
}
