import { DynamicModule, Module } from '@nestjs/common';
import { FileStore } from './file-store.abstract';
import { ModuleFactoryOption } from '@utils/module.utils';

@Module({})
export class FileStoreModule {
  static registerAsync(option: ModuleFactoryOption<FileStore>): DynamicModule {
    return {
      module: FileStoreModule,
      providers: [
        {
          inject: [...(option.inject ?? [])],
          provide: FileStore,
          useFactory: async (...injections: unknown[]) => {
            return option.useFactory(...injections);
          },
        },
      ],
      exports: [FileStore],
    };
  }
}
