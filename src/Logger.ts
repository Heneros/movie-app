import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

const isProd = process.env.NODE_ENV === 'production';

const transports: winston.transport[] = [
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
];

if (!isProd) {
    transports.push(
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
    );
}

export const winstonLoggerOptions: winston.LoggerOptions = {
    transports,
};
