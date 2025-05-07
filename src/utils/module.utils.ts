import { FactoryProvider, ModuleMetadata } from '@nestjs/common';

export type ModuleFactoryOption<O> = Pick<ModuleMetadata, 'imports'> &
  Pick<FactoryProvider<O>, 'inject' | 'useFactory'>;
