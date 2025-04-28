import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import IORedis, { Redis } from 'ioredis';
import { Subject } from 'rxjs';

@Injectable()
export class RedisClient {
    private _pub_client: Redis;
    private _sub_client: Redis;

    private readonly subscribed_events = new Set<string>();
    public readonly events$ = new Subject<{
        channel: string;
        message: string;
    }>();

    constructor(private readonly config: ConfigService) {
        // if (!this._pub_client) {
        //     this.createPubClient();
        // }
        // if (!this._sub_client) {
        //     this.createSubClient();
        // }
    }

    public get pub() {
        if (!this._pub_client) {
            this.createPubClient();
        }

        return this._pub_client;
    }

    public get sub() {
        if (!this._pub_client) {
            this.createPubClient();
        }
        return this._sub_client;
    }

    public subscribe(event_name: string) {
        this.subscribed_events.add(event_name);
        this.sub.subscribe(event_name);
    }

    public unsubscribe(event_name: string) {
        if (this._sub_client) {
            this._sub_client.unsubscribe(event_name);
        }

        this.subscribed_events.delete(event_name);
    }

    private createPubClient() {}

    private createSubClient() {
        this._sub_client = new IORedis({});
    }
}
