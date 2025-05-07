import { LoggerModule } from '@common';
import { GitLFSModule } from '@domain/git-lfs/git-lfs.module';
import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import {
  AnyErrorFilter,
  FallbackErrorFilter,
  HttpErrorFilter,
} from './filters';

@Module({
  providers: [
    { provide: APP_FILTER, useClass: FallbackErrorFilter },
    { provide: APP_FILTER, useClass: HttpErrorFilter },
    { provide: APP_FILTER, useClass: AnyErrorFilter },
  ],
  imports: [LoggerModule, GitLFSModule],
})
export class AppModule {}
