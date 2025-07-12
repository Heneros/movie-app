import { ArgumentsHost } from '@nestjs/common';
import { BaseExceptionFilter, HttpAdapterHost } from '@nestjs/core';
import { Prisma } from '@prisma/client';
export declare class PrismaClientExceptionFilter extends BaseExceptionFilter {
    private readonly adapterHost;
    constructor(adapterHost: HttpAdapterHost);
    catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost): void;
}
