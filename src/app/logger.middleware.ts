import { InjectLogger, Logger } from '@common';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(
    @InjectLogger()
    private readonly logger: Logger,
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      const log = [
        req.method,
        req.url,
        res.statusCode,
        `${duration}ms`,
        req.headers['user-agent'],
        req.headers['x-forwarded-for'] || req.socket.remoteAddress,
      ];
      this.logger.info(log.join(' '));
    });
    next();
  }
}
