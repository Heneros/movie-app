import { transports, format } from 'winston';
import {
  WinstonModule,
  utilities as nestWinstonModuleUtilities,
} from 'nest-winston';
import 'winston-daily-rotate-file';
import * as fs from 'fs';

// Проверяем, существует ли папка logs, если нет — создаём
const logDir = 'logs';
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

export const LoggerFactory = (appName: string) => {
  const consoleFormat = format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.ms(),
    format.errors({ stack: true }), // Добавляем ошибки со стек-трейсом
    nestWinstonModuleUtilities.format.nestLike(appName, {
      colors: true,
      prettyPrint: true,
    }),
  );

  return WinstonModule.createLogger({
    level: 'info',
    format: format.combine(format.timestamp(), format.json()),
    transports: [
      new transports.DailyRotateFile({
        filename: `${logDir}/combined-%DATE%.log`,
        datePattern: 'YYYY-MM-DD',
        maxFiles: '14d',
        handleExceptions: true, // Обрабатывает необработанные ошибки
        handleRejections: true, // Обрабатывает необработанные промисы
      }),
      new transports.File({
        level: 'error',
        filename: `${logDir}/error.log`,
        handleExceptions: true,
        handleRejections: true,
      }),
      new transports.Console({
        format: consoleFormat,
        silent: process.env.NODE_ENV === 'test', // Отключает логи в тестах
      }),
    ],
    exceptionHandlers: [
      new transports.File({ filename: `${logDir}/exception.log` }),
    ],
    rejectionHandlers: [
      new transports.File({ filename: `${logDir}/rejections.log` }),
    ],
  });
};
