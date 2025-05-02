// src/logger/winston.config.ts
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

export const winstonLoggerOptions: winston.LoggerOptions = {
    transports: [
        // error logs
        new winston.transports.DailyRotateFile({
            filename: 'logs/%DATE%-error.log',
            level: 'error',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json(),
            ),
            handleExceptions: true,
            datePattern: 'YYYY-MM-DD',
            zippedArchive: false,
            maxFiles: '30d',
            maxSize: '20m',
        }),
        // combined logs
        new winston.transports.DailyRotateFile({
            filename: 'logs/%DATE%-combined.log',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json(),
            ),
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxFiles: '30d',
        }),

        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.cli(),
                winston.format.splat(),
                winston.format.timestamp(),
                winston.format.printf((info) => {
                    return `${info.timestamp} ${info.level}: ${info.message}`;
                }),
            ),
        }),
    ],
};
