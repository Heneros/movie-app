import { PAGINATION_LIMIT } from '@/data/defaultData';
import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import express, { Response } from 'express';

@Injectable()
export class GetAllUsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(skip: number) {
    return this.prisma.user.findMany({
      skip: skip,
      take: PAGINATION_LIMIT,
    });
  }
}
