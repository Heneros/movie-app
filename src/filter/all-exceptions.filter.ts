import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    InternalServerErrorException,
    Inject,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    ) {}

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : new InternalServerErrorException().getStatus();

        const message =
            exception instanceof HttpException
                ? exception.getResponse()
                : exception;

        this.logger.error('🚨 Exception', {
            statusCode: status,
            path: request.url,
            method: request.method,
            message,
        });

        response.status(status).json({
            statusCode: status,
            message,
        });
    }
}
