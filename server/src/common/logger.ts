import * as winston from 'winston';

export class Logger {
  private logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json(),
    ),
    transports: [
      new winston.transports.File({
        filename: 'logs/error.log',
        level: 'error',
      }),
      new winston.transports.Console(),
    ],
  });

  error(message: unknown) {
    this.logger.error(message);
  }

  info(message: unknown) {
    this.logger.info(message);
  }
}
