import { InjectLogger, Logger } from '@common';
import { HttpError } from '@common/error';
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import express from 'express';

@Catch(HttpError)
export class HttpErrorFilter implements ExceptionFilter {
  constructor(
    @InjectLogger()
    private readonly logger: Logger,
  ) {}

  catch(exception: HttpError, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<express.Response>();
    const cause = exception.cause ?? exception;

    console.log('http error');
    console.log(cause);
    this.logger.error(cause);

    return exception.respond(response);
  }
}
