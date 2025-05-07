import { HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

export class HttpError extends Error {
  cause?: Error;
  code?: string;
  context: Record<string, unknown>;

  constructor(
    public statusCode: HttpStatus,
    public message: string,
  ) {
    super(message);
    this.name = this.constructor.name;
  }

  static fromHttpException(err: HttpException) {
    const status = err.getStatus();

    const error = new HttpError(status, err.message)
      .setCause(err)
      .setName(err.name);

    return error;
  }

  setName(name: string) {
    this.name = name;
    return this;
  }

  setCause(cause: Error) {
    this.cause = cause;
    return this;
  }

  setCode(code: string) {
    this.code = code;
    return this;
  }

  setContext(context: Record<string, unknown>) {
    this.context = context;
    return this;
  }

  toResponseData() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      context: this.context,
    };
  }

  respond(res: Response) {
    return res.status(this.statusCode).json(this.toResponseData());
  }
}

export class BadRequestError extends HttpError {
  constructor(message: string) {
    super(HttpStatus.BAD_REQUEST, message);
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message: string) {
    super(HttpStatus.UNAUTHORIZED, message);
  }

  static needsToBeUser() {
    return new UnauthorizedError('로그인이 필요합니다.');
  }

  static failedToAuthenticate(err?: any) {
    const error = new UnauthorizedError('로그인에 실패했습니다.');
    throw error.setCause(err);
  }
}

export class ForbiddenError extends HttpError {
  constructor(message: string) {
    super(HttpStatus.FORBIDDEN, message);
  }
}

export class NotFoundError extends HttpError {
  constructor(message: string) {
    super(HttpStatus.NOT_FOUND, message);
  }

  static create(name: string, id?: string | number) {
    name = id ? `"${name}" (${id})` : `"${name}"`;
    return new NotFoundError(`${name}을 찾을 수 없습니다.`);
  }
}

export class ConflictError extends HttpError {
  constructor(message: string) {
    super(HttpStatus.CONFLICT, message);
  }
}

export class InternalServerError extends HttpError {
  constructor(error: any) {
    super(HttpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error');
    this.cause = error instanceof Error ? error : new Error(error);
    this.stack = this.cause.stack;
  }
}
