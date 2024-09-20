import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  HttpCode,
  Header,
  Redirect,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Request } from 'express';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get('docs')
  // @Redirect('https://docs.nestjs.com', 302)
  getTest() {
    return 'Hello World';
  }

  @Get()
  @HttpCode(204)
  @Header('Cache-Control', 'none')
  findAll(@Req() request: Request): string {
    console.log('123');
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') params: any): string {
    console.log(params.id);
    return `This action returns a #${params.id} user`;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
