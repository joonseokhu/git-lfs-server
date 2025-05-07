import { Response } from 'express';
import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';

export class GitLFSInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const res = context.switchToHttp().getResponse<Response>();

    return next
      .handle()
      .pipe(tap(() => res.contentType('application/vnd.git-lfs+json')));
  }
}
