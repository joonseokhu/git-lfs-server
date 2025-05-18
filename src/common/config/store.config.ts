import * as ssh from 'ssh2';
import { Injectable } from '@nestjs/common';
import { LoadedConfig } from './loaded.config';

@Injectable()
export class StoreConfig {
  constructor(private readonly config: LoadedConfig) {}

  get storeSSHConfig(): ssh.ConnectConfig | undefined {
    if (!this.config.STORE_SSH_HOST) return undefined;

    const host = this.config.STORE_SSH_HOST;
    const port = this.config.STORE_SSH_PORT ?? 22;
    const username = this.config.STORE_SSH_USER;

    return this.config.STORE_SSH_PRIVATE_KEY
      ? { host, port, username, privateKey: this.config.STORE_SSH_PRIVATE_KEY }
      : { host, port, username, password: this.config.STORE_SSH_PASSWORD };
  }

  get storeDirectory(): string {
    return this.config.STORE_DIRECTORY;
  }
}
