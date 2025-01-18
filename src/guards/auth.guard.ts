import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from 'src/prisma/prisma.service';
import * as jwt from 'jsonwebtoken';

interface JwtPayload {
  name: string;
  roles: string[];
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
      const authHeader = request.headers?.authorization;

      const token = authHeader?.split('Bearer ')[1];

      try {
        const payload = jwt.verify(token, process.env.JWT_KEY) as JwtPayload;
        // console.log('payload', payload);
        const user = await this.prismaService.user.findUnique({
          where: {
            id: payload.id,
          },
        });
        if (!user) return false;

        if (roles.some((role) => payload.roles.includes(role))) {
          request.user = payload;
          return true;
        }
        return false;
      } catch (error) {
        console.log('error', error);
        return false;
      }
    }
    console.log('error');
    return true;
  }
}
