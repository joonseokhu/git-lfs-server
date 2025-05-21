import * as ssh from 'ssh2';
import { Injectable } from '@nestjs/common';
import { LoadedConfig } from './loaded.config';
import { ConfigType } from '@utils/config';

@Injectable()
export class StoreConfig extends ConfigType(LoadedConfig) {
  get storeSSHConfig(): ssh.ConnectConfig | undefined {
    if (!this.loaded.STORE_SSH_HOST) return undefined;

    const host = this.loaded.STORE_SSH_HOST;
    const port = this.loaded.STORE_SSH_PORT ?? 22;
    const username = this.loaded.STORE_SSH_USER;

    return this.loaded.STORE_SSH_PRIVATE_KEY
      ? { host, port, username, privateKey: this.loaded.STORE_SSH_PRIVATE_KEY }
      : { host, port, username, password: this.loaded.STORE_SSH_PASSWORD };
  }

  get storeDirectory(): string {
    return this.loaded.STORE_DIRECTORY;
  }
}
