import {
  AppConfig,
  AuthConfig,
  LFSConfig,
  LoggerModule,
  StoreConfig,
} from '@common';
import { LoadedConfig } from '@common/config/loaded.config';
import { GitLFSModule } from '@domain/git-lfs/git-lfs.module';
import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { ConfigModule } from '@utils/config';
import {
  AnyErrorFilter,
  FallbackErrorFilter,
  HttpErrorFilter,
} from './filters';

@Module({
  imports: [
    ConfigModule.forRoot(LoadedConfig),
    ConfigModule.forFeature(AppConfig, AuthConfig, StoreConfig, LFSConfig),
    LoggerModule,
    GitLFSModule,
  ],
  providers: [
    { provide: APP_FILTER, useClass: AnyErrorFilter },
    { provide: APP_FILTER, useClass: HttpErrorFilter },
    { provide: APP_FILTER, useClass: FallbackErrorFilter },
  ],
})
export class AppModule {}
