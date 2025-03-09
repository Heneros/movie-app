// import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
// import { Cache } from 'cache-manager';

@Injectable()
export class AppService {
    // constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}
    //   async getCachedData(): Promise<string> {
    //     const cachedData = await this.cacheManager.get<string>('cachedData');
    //     if (cachedData) {
    //       console.log('Data from cache:', cachedData);
    //       return `Data from cache: ${cachedData}`;
    //     }

    ////
    //     const newData = 'Data from bd';
    //     console.log('Data from cache', newData, Date.now());
    //     await this.cacheManager.set('cachedData', newData, 1500);
    //     // await this.cacheManager.del('key');
    //     // return `From service: ${newData}`;
    //   }
}
