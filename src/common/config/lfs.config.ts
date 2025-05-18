import { ConfigType } from '@utils/config';
import { LoadedConfig } from './loaded.config';

export class LFSConfig extends ConfigType(LoadedConfig) {
  get batchExpiry() {
    return this.loaded.BATCH_EXPIRY;
  }

  get jwtSecret() {
    return this.loaded.JWT_SECRET;
  }
}
