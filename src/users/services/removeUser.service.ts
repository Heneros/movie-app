import { PrismaService } from '@/prisma/prisma.service';
import {
  BadGatewayException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class RemoveUserAccountService {
  constructor(private prisma: PrismaService) {}

  async remove(id: number) {
    const userIsAdmin = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!userIsAdmin) {
      throw new ForbiddenException('User not found');
    }

    if (!userIsAdmin.roles?.includes['Admin']) {
      throw new ForbiddenException('Admin cannot delete their own account');
    }

    return this.prisma.$transaction(async (tx) => {
      await tx.verifyResetToken.deleteMany({
        where: { userId: id },
      });
      return tx.user.delete({
        where: { id },
      });
    });

    // console.log(userIsAdmin);
  }
}
