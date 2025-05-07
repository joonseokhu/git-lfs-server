import { BaseLoadedConfig } from '@utils/config';
import { Expose } from 'class-transformer';
import { IsInt, IsNotEmpty, IsUrl } from 'class-validator';

export class LoadedConfig extends BaseLoadedConfig {
  @Expose()
  @IsInt()
  @IsNotEmpty()
  PORT: number = 8080;

  @Expose()
  @IsNotEmpty()
  LOG_PATH: string = '/var/log/git-lfs';

  @Expose()
  @IsUrl()
  @IsNotEmpty()
  STORE_DIRECTORY: string = '/srv/git-lfs';

  @Expose()
  @IsInt()
  @IsNotEmpty()
  HTTP_PORT: number = 8080;

  @Expose()
  @IsNotEmpty()
  SSH_PORT: number = 2222;
}
