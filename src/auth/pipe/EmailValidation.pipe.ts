import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class EmailValidationPipe implements PipeTransform {
  constructor(private prisma: PrismaService) {}

  async transform(value: { userId?: number; email?: string }) {
    if (!value.userId && !value.email) {
      throw new BadRequestException('Either userId or email must be provided');
    }

    const user = await this.prisma.user.findUnique({
      where: {
        id: value.userId,
        email: value.email,
      },
    });

    if (!user) {
      throw new BadRequestException('No user exists with this email');
    }

    if (!user.isEmailVerified) {
      throw new BadRequestException('Email not verified');
    }
    return value;
  }
}
