import { DynamicModule, Inject } from '@nestjs/common';
import { ModuleFactoryOption } from '@utils/module.utils';
import { ClassType } from '@utils/types';
import { getJWTModuleKey } from './jwt.meta';
import { JWTService } from './jwt.service';
import { JWTModuleOptions } from './jwt.types';

export const InjectJWT = <T>(target: ClassType<T>) => {
  return Inject(getJWTModuleKey(target));
};

export class JWTModule {
  static registerAsync<T>(
    target: ClassType<T>,
    options: ModuleFactoryOption<JWTModuleOptions>,
  ): DynamicModule {
    return {
      module: JWTModule,
      imports: options.imports,
      providers: [
        {
          provide: getJWTModuleKey(target),
          inject: options.inject,
          async useFactory(...injections: unknown[]) {
            const jwtOptions = await options.useFactory(...injections);
            return new JWTService(target, jwtOptions);
          },
        },
      ],
      exports: [getJWTModuleKey(target)],
    };
  }
}
