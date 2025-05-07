import { Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER, WinstonModule } from 'nest-winston';
import winston, { Logger } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { AppConfig } from './config';

export const LoggerModule = WinstonModule.forRootAsync({
  inject: [AppConfig],
  useFactory(config: AppConfig) {
    return {
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple(),
          ),
        }),
        new DailyRotateFile({
          dirname: config.logPath,
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json(),
          ),
          filename: 'automation.log.%DATE%',
          maxSize: '1m',
          maxFiles: '14d',
        }),
      ],
    };
  },
});

export const InjectLogger = () => Inject(WINSTON_MODULE_PROVIDER);
export type { Logger };
