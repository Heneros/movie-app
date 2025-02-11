import { PrismaService } from '@/prisma/prisma.service';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ExecException } from 'child_process';

@Injectable()
export class ProfileOwnerGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers?.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('No authorization header');
    }

    const token = authHeader?.split('Bearer ')[1];
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }
    let userIdFromToken: number;

    try {
      const decodedToken = this.jwtService.verify(token);
      userIdFromToken = decodedToken.id;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }

    const idFromParams = +request.params.id;
    console.log(userIdFromToken, idFromParams);
    if (userIdFromToken !== idFromParams) {
      throw new ForbiddenException(
        'You are not authorized to update this profile',
      );
    }

    return true;
  }
}
