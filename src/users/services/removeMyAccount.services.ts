import { PrismaService } from '@/prisma/prisma.service';
import {
  BadGatewayException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class RemoveMyAccountService {
  constructor(private prisma: PrismaService) {}

  async remove(id: number) {}
}
