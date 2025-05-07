import { InjectLogger, Logger } from '@common';
import { NotFoundError } from '@common/error';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  NotFoundException,
} from '@nestjs/common';
import express from 'express';

@Catch(NotFoundException)
export class FallbackErrorFilter implements ExceptionFilter {
  constructor(
    @InjectLogger()
    private readonly logger: Logger,
  ) {}

  catch(exception: any, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const req = context.getRequest<express.Request>();
    const res = context.getResponse<express.Response>();
    this.logger.info('fallback', req.method, req.url);

    return NotFoundError.create(req.url).respond(res);
  }
}
