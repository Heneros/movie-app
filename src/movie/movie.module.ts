import { Module } from '@nestjs/common';
import { MovieService } from './movie.service';
import { MovieController } from './movie.controller';
import { PrismaModule } from '@/prisma/prisma.module';
import { CacheModule } from '@nestjs/cache-manager';
import { MovieFavorite } from './services/addMovieFavoriteList.service';

@Module({
  controllers: [MovieController],
  providers: [MovieService, MovieFavorite],
  imports: [PrismaModule, CacheModule.register()],
})
export class MovieModule {}
