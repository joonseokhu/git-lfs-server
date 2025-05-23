import {
  AppConfig,
  AuthConfig,
  LFSConfig,
  LoggerModule,
  StoreConfig,
} from '@common';
import express from 'express';
import { LoadedConfig } from '@common/config/loaded.config';
import { GitLFSModule } from '@domain/git-lfs/git-lfs.module';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { ConfigModule } from '@utils/config';
import {
  AnyErrorFilter,
  FallbackErrorFilter,
  HttpErrorFilter,
} from './filters';
import { appPipe } from './app-pipe';
import { LoggerMiddleware } from './logger.middleware';

@Module({
  imports: [
    ConfigModule.forRoot(LoadedConfig),
    ConfigModule.forFeature(AppConfig, AuthConfig, StoreConfig, LFSConfig),
    LoggerModule,
    GitLFSModule,
  ],
  providers: [
    { provide: APP_PIPE, useValue: appPipe },
    { provide: APP_FILTER, useClass: AnyErrorFilter },
    { provide: APP_FILTER, useClass: HttpErrorFilter },
    { provide: APP_FILTER, useClass: FallbackErrorFilter },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        LoggerMiddleware,
        express.json({ type: 'application/vnd.git-lfs+json' }),
      )
      .forRoutes('*');
  }
}
