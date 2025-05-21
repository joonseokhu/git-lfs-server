import { BaseLoadedConfig } from '@utils/config';
import { Expose, Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import ms from 'ms';

export class LoadedConfig extends BaseLoadedConfig {
  @Expose()
  @IsInt()
  @IsNotEmpty()
  PORT: number = 8080;

  @Expose()
  @IsString()
  @IsNotEmpty()
  BASE_URL: string = 'http://localhost:8080';

  @Expose()
  @IsNotEmpty()
  LOG_PATH: string = '/var/log/git-lfs';

  @Expose()
  @IsString()
  @IsNotEmpty()
  STORE_DIRECTORY: string = '/srv/git-lfs';

  @Expose()
  @IsString()
  @IsOptional()
  STORE_SSH_HOST?: string;

  @Expose()
  @IsInt()
  STORE_SSH_PORT: number = 22;

  @Expose()
  @IsString()
  @IsOptional()
  STORE_SSH_USER?: string;

  @Expose()
  @IsString()
  @IsOptional()
  STORE_SSH_PRIVATE_KEY?: string;

  @Expose()
  @IsString()
  @IsOptional()
  STORE_SSH_PASSWORD?: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  JWT_SECRET: string = 'secret';

  @Expose()
  @IsNotEmpty()
  @Type(() => String)
  BATCH_EXPIRY: ms.StringValue = '30m';
}
