import { InjectLogger, Logger } from '@common';
import { InternalServerError } from '@common/error';
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import express from 'express';

@Catch()
export class AnyErrorFilter implements ExceptionFilter {
  constructor(
    @InjectLogger()
    private readonly logger: Logger,
  ) {}

  catch(exception: Error, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const res = context.getResponse<express.Response>();

    const cause = (exception.cause ?? exception) as Error;

    this.logger.error(cause);
    return new InternalServerError(cause).respond(res);
  }
}
