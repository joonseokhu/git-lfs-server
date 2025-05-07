import { DynamicModule, Global, Module, Type } from '@nestjs/common';
import { BaseConfig, BaseLoadedConfig } from './config.service';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

const LOADED_CONFIG = 'LOADED_CONFIG';

@Global()
@Module({})
export class ConfigModule {
  static forRoot(LoadedConfig: Type<BaseLoadedConfig>): DynamicModule {
    return {
      module: ConfigModule,
      global: true,
      providers: [
        {
          provide: LOADED_CONFIG,
          useFactory: () => {
            const result = plainToInstance(LoadedConfig, process.env ?? {}, {
              enableImplicitConversion: true,
              excludeExtraneousValues: true,
              exposeDefaultValues: true,
            });
            const errors = validateSync(result);
            if (errors?.length) throw new Error(errors.toString());
            return result;
          },
        },
      ],
      exports: [LOADED_CONFIG],
    };
  }

  static forFeature(...Services: Type<BaseConfig>[]): DynamicModule {
    return {
      module: ConfigModule,
      global: true,
      providers: [
        ...Services.map((Service) => ({
          provide: Service,
          inject: [LOADED_CONFIG],
          useFactory(loaded: unknown) {
            return new Service(loaded);
          },
        })),
      ],
      exports: Services,
    };
  }
}
