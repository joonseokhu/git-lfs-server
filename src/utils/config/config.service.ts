import { Injectable, Type } from '@nestjs/common';
import { Expose } from 'class-transformer';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { NodeEnv } from './types';

export class BaseLoadedConfig {
  @Expose()
  @IsEnum(NodeEnv)
  @IsNotEmpty()
  NODE_ENV: NodeEnv = NodeEnv.DEVELOPMENT;
}

export abstract class BaseConfig<
  T extends BaseLoadedConfig = BaseLoadedConfig,
> {
  loaded: T;
}

export const ConfigType = <T extends BaseLoadedConfig = BaseLoadedConfig>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Loaded: Type<T>,
): Type<BaseConfig<T>> => {
  @Injectable()
  class ConfigServiceMixin implements BaseConfig<T> {
    constructor(readonly loaded: T) {}
  }

  return ConfigServiceMixin;
};
