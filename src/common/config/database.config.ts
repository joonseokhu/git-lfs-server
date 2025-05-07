import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { LoadedConfig } from './loaded.config';

@Injectable()
export class DatabaseConfig {
  constructor(private readonly config: LoadedConfig) {}

  get connectionOption(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.config.DATABASE_HOST,
      port: this.config.DATABASE_PORT,
      username: this.config.DATABASE_USERNAME,
      password: this.config.DATABASE_PASSWORD,
      database: this.config.DATABASE_NAME,
    };
  }
}
