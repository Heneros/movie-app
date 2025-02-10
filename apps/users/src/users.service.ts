import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  private users = [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      age: 432,
    },

    {
      id: 2,
      firstName: 'Todd',
      lastName: 'Howard',
      age: 23,
    },
    ,
  ];

  findAll() {
    return this.users;
  }
}
