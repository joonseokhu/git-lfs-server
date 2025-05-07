import { ConfigType, NodeEnv } from '@utils/config';
import path from 'path';
import { LoadedConfig } from './loaded.config';

export class AppConfig extends ConfigType(LoadedConfig) {
  get nodeEnv() {
    return this.loaded.NODE_ENV;
  }

  get isProduction() {
    return this.nodeEnv === NodeEnv.PRODUCTION;
  }

  get isDevelop() {
    return this.nodeEnv === NodeEnv.DEVELOPMENT;
  }

  get port() {
    return Number(this.loaded.PORT);
  }

  get logPath() {
    return this.isDevelop
      ? path.join(process.cwd(), 'logs')
      : path.resolve(this.loaded.LOG_PATH);
  }
}
