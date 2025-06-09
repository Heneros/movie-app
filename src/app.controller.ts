import { Controller, Get, UseInterceptors } from '@nestjs/common';
// import { RedisService } from './cache.service';
import { AppService } from './app.service';
// import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get('/healthcheck')
    async healthCheck() {
        return { status: 'ok', timestamp: new Date().toISOString() };
    }

    // @Get()
    // // @CacheTTL(20)
    // // @UseInterceptors(CacheInterceptor)
    // async getUsers(): Promise<any> {
    //   return this.appService.getCachedData();
    // }
}
