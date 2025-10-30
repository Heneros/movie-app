import { PrismaService } from '@/prisma/prisma.service';
import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { ExecException } from 'child_process';

@Injectable()
export class ProfileOwnerGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) {}

    canActivate(context: ExecutionContext): boolean {
        let request: any;
        let idFromParams: number | null = null;

        if (context.getType().toString() === 'http') {
            request = context.switchToHttp().getRequest();
            idFromParams = +request.params.userId;
            //    console.log(request.params);
        } else {
            const gqlContext = GqlExecutionContext.create(context);
            request = gqlContext.getContext().req;
            const args = gqlContext.getArgs();
            idFromParams = +args.userId || +args.id || args.input.userId;
            // console.log(idFromParams);
        }

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
            userIdFromToken = decodedToken.id || decodedToken.userId;
        } catch (error) {
            throw new UnauthorizedException('Invalid token');
        }
        // console.log(userIdFromToken);
        // console.log(idFromParams);
        if (!idFromParams || userIdFromToken !== idFromParams) {
            throw new ForbiddenException(
                'You are not authorized to have access to this profile',
            );
        }

        return true;
    }
}
