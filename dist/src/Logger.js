"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.winstonLoggerOptions = void 0;
const winston = __importStar(require("winston"));
require("winston-daily-rotate-file");
const isProd = process.env.NODE_ENV === 'production';
const transports = [
    new winston.transports.Console({
        format: winston.format.combine(winston.format.cli(), winston.format.splat(), winston.format.timestamp(), winston.format.printf((info) => {
            return `${info.timestamp} ${info.level}: ${info.message}`;
        })),
    }),
];
if (!isProd) {
    transports.push(new winston.transports.DailyRotateFile({
        filename: 'logs/%DATE%-error.log',
        level: 'error',
        format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
        handleExceptions: true,
        datePattern: 'YYYY-MM-DD',
        zippedArchive: false,
        maxFiles: '30d',
        maxSize: '20m',
    }), new winston.transports.DailyRotateFile({
        filename: 'logs/%DATE%-combined.log',
        format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxFiles: '30d',
    }));
}
exports.winstonLoggerOptions = {
    transports,
};
//# sourceMappingURL=Logger.js.map