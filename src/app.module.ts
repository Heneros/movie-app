import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { MovieModule } from './movie/movie.module';
// import { UsersModule } from './users/users.module';

@Module({
  imports: [UsersModule, PrismaModule, MovieModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
