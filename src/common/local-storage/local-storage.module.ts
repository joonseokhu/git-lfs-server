import { Global, Module } from '@nestjs/common';
import { ClsModule } from 'nestjs-cls';
import { LocalStorage } from './local-storage.service';

@Global()
@Module({
  imports: [
    ClsModule.forRoot({
      global: true,
      middleware: { mount: true, generateId: true },
    }),
    ClsModule.forFeatureAsync({
      global: true,
      useClass: LocalStorage,
    }),
  ],
})
export class LocalStorageModule {}
