import { CanActivate, ExecutionContext, LoggerService } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '@/prisma/prisma.service';
export declare class AuthGuard implements CanActivate {
    private readonly logger;
    private readonly reflector;
    private readonly prismaService;
    constructor(logger: LoggerService, reflector: Reflector, prismaService: PrismaService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
