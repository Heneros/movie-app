import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GetIdUsersService {
  constructor(private prisma: PrismaService) {}

  async findOne(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }
}
