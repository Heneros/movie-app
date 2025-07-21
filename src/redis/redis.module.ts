// import { Module } from '@nestjs/common';
// import { ConfigModule, ConfigService } from '@nestjs/config';
// import { RedisService } from './redis.service';
// import Redis from 'ioredis';

// @Module({
//     imports: [
//         ConfigModule.forRoot({
//             isGlobal: true,
//             envFilePath: '.env',
//         }),
//     ],
//     providers: [
//         RedisService,
//         {
//             provide: 'RedisClient',
//             useFactory: (cs: ConfigService) => {
//                 const redisUrl = cs.get<string>('REDIS_URL_ORIGINAL');
//                 if (!redisUrl) {
//                     throw new Error(
//                         'REDIS_URL_ORIGINAL is not defined in .env',
//                     );
//                 }
       
//                 return new Redis(redisUrl);
  

//                 // return new Redis(raw);
//             },
//             inject: [ConfigService],
//         },
//     ],
//     exports: ['RedisClient', RedisService],
// })
// export class RedisModule {}
