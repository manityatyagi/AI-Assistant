import winston, { createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const { combine, printf, errors, colorize, timestamp } = format;

const logFormat = printf(({level, message, timestamp, stack}) => {
    return `${timestamp} ${level}: ${stack || message}`
});

 const logger = createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: combine(
        colorize(),
        timestamp({format:'YYYY-MM-DD HH:mm:ss'}),
        errors({stack: true}),
        logFormat
    ),
    transports: [ 
        new winston.transports.Console({
            format: winston.format.simple()
        }),
        new DailyRotateFile({
            filename:'logs/application-%Date%.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '7d'
        })
    ],
    exceptionHandlers: [
        new winston.transports.File({ filename: 'logs/exceptions.log'})
    ]
});

logger.stream = {
    write: (message) => logger.info(message.trim())
};

export { logger }