import { Injectable } from '@nestjs/common';
import { BookDto } from './books/dto/book.dto';
import { CreateBookDto } from './books/dto/create-book.dto';

@Injectable()
export class BooksService {
  private books: BookDto[] = [
    {
      id: 1,
      title: 'Harry',
      author: 'JK',
      rating: 3.5,
    },

    {
      id: 2,
      title: 'Pirates',
      author: 'Howard',
      rating: 6.5,
    },
    ,
  ];

  create(createBookDto: CreateBookDto) {
    const newBook: BookDto = {
      ...createBookDto,
      id: this.books.length + 1,
    };

    this.books.push(newBook);
    return newBook;
  }

  findAll() {
    return this.books;
  }
}
