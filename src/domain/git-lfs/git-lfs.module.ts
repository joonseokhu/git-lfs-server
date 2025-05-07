import { LocalStoreConfig } from '@common';
import { FileStoreModule, LocalFileStore } from '@domain/file-store';
import { Module } from '@nestjs/common';
import { GitLFSBatchService } from './git-lfs-batch.service';
import { GitLFSController } from './git-lfs.controller';
import { GitLFSService } from './git-lfs.service';

@Module({
  imports: [
    FileStoreModule.registerAsync({
      inject: [LocalStoreConfig],
      useFactory: (localStoreConfig: LocalStoreConfig) => {
        return new LocalFileStore(localStoreConfig);
      },
    }),
  ],
  controllers: [GitLFSController],
  providers: [GitLFSService, GitLFSBatchService],
})
export class GitLFSModule {}
