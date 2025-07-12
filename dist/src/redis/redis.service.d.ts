import { Redis } from '@upstash/redis';
export declare class RedisService {
    private readonly redis;
    constructor(redis: Redis);
    private makeKey;
    saveMovies(page: string, data: any): Promise<void>;
    deleteMovies(page: string): Promise<void>;
    getMovies(page: string): Promise<string | null>;
}
