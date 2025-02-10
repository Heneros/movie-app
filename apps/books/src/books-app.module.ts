import { Module } from '@nestjs/common';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { BooksModule } from './books/books.module';
import { BooksModule } from './bookstore-api-gateway/books/books.module';

@Module({
  imports: [BooksModule],
  controllers: [],
  providers: [],
})
export class BooksAppModule {}
