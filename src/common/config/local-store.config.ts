import { Injectable } from '@nestjs/common';
import { LoadedConfig } from './loaded.config';

@Injectable()
export class LocalStoreConfig {
  constructor(private readonly config: LoadedConfig) {}

  get storeDirectory(): string {
    return this.config.STORE_DIRECTORY;
  }
}
