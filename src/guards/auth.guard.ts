import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from 'src/prisma/prisma.service';
import * as jwt from 'jsonwebtoken';
import { IS_PUBLIC_KEY } from 'src/decorators/public.decorator';

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

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers?.authorization;

    // console.log('Cookies:', request.cookies);
    // const cookie = request.cookies;
    // console.log(cookie);

    if (!authHeader) {
      throw new UnauthorizedException('No authorization header');
    }

    const token = authHeader?.split('Bearer ')[1];
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    const roles = this.reflector.getAllAndOverride('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (roles?.length) {
      // console.log('roles?.length');
      try {
        const payload = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
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
    return true;
  }
}
