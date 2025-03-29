import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
    private client: RedisClientType;

    constructor() {
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
}
