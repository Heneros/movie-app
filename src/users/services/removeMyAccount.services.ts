import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RemoveMyAccountService {
  constructor(private prisma: PrismaService) {}

  async remove(id: number) {
    return this.prisma.$transaction(async (tx) => {
      await tx.verifyResetToken.deleteMany({
        where: { userId: id },
      });
      return await this.prisma.user.delete({
        where: { id },
      });
    });
  }
}
