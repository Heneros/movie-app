import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { UpdateUserRole } from '../dto/update-user-role.dto';

@Injectable()
export class ChangeRoleService {
  constructor(private prisma: PrismaService) {}

  async changeRole(id: number, updateUserRole: UpdateUserRole) {
    return this.prisma.user.update({
      where: { id },
      data: {
        roles: updateUserRole.roles,
      },
    });
  }
}
