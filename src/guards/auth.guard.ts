import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from 'src/prisma/prisma.service';
import * as jwt from 'jsonwebtoken';

interface JwtPayload {
  name: string;
  id: number;
  lat: number;
  exp: number;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prismaService: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const roles = this.reflector.getAllAndOverride('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    const request = context.switchToHttp().getRequest();
    if (roles?.length) {
      const authHeader = request.headers?.Authorization;

      const token = authHeader?.split('Bearer ')[1];

      try {
        const payload = jwt.verify(token, process.env.JWT_KEY) as JwtPayload;

        const user = await this.prismaService.user.findUnique({
          where: {
            id: payload.id,
          },
        });
        if (!user) return false;

        if (roles.includes(user.roles)) {
          request.user = payload;
          return true;
        }
        return false;
      } catch (error) {
        return false;
      }
    }
    return true;
  }
}
