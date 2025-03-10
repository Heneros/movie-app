import { PAGINATION_LIMIT, roundsOfHashing } from '@/data/defaultData';
import { PrismaService } from '@/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import express, { Response } from 'express';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UpdateUserService {
  constructor(private prisma: PrismaService) {}

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(
        updateUserDto.password,
        roundsOfHashing,
      );
    }

    return this.prisma.user.update({ where: { id }, data: updateUserDto });
  }
}
