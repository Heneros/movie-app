import { transports, format } from 'winston';
import {
    WinstonModule,
    utilities as nestWinstonModuleUtilities,
} from 'nest-winston';
import 'winston-daily-rotate-file';

const fileRotateTransport = new transports.DailyRotateFile({
    filename: 'logs/combined-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    maxFiles: '14d',
});

export const LoggerFactory = (appName: string) => {
    let consoleFormat;

    consoleFormat = format.combine(
        format.timestamp(),
        format.ms(),
        nestWinstonModuleUtilities.format.nestLike(appName, {
            colors: true,
            prettyPrint: true,
        }),
    );

    return WinstonModule.createLogger({
        level: 'info',
        transports: [
            fileRotateTransport,
            new transports.File({
                level: 'error',
                filename: 'logs/error.log',
            }),
        ],
        exceptionHandlers: [
            new transports.File({ filename: 'logs/exception.log' }),
        ],
        rejectionHandlers: [
            new transports.File({ filename: 'logs/rejections.log' }),
        ],
    });
};
