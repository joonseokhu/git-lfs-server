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
  LOG_PATH: string = '/var/log/automation';

  @Expose()
  @IsUrl()
  @IsNotEmpty()
  DATABASE_HOST: string = 'localhost';

  @Expose()
  @IsInt()
  @IsNotEmpty()
  DATABASE_PORT: number = 5432;

  @Expose()
  @IsNotEmpty()
  DATABASE_USERNAME: string = 'postgres';

  @Expose()
  @IsNotEmpty()
  DATABASE_PASSWORD: string = 'postgres';

  @Expose()
  @IsNotEmpty()
  DATABASE_NAME: string = 'postgres';
}
