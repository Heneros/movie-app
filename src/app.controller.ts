import { Controller, Get, UseInterceptors } from '@nestjs/common';
// import { RedisService } from './cache.service';
import { AppService } from './app.service';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  // @CacheTTL(20)
  // @UseInterceptors(CacheInterceptor)
  async getUsers(): Promise<any> {
    return this.appService.getCachedData();
  }
}
