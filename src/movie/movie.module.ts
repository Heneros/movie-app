import { Module } from '@nestjs/common';
import { MovieService } from './movie.service';
import { MovieController } from './movie.controller';
import { PrismaModule } from '@/prisma/prisma.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  controllers: [MovieController],
  providers: [MovieService],
  imports: [PrismaModule, CacheModule.register()],
})
export class MovieModule {}
