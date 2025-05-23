import { LFSConfig, StoreConfig } from '@common';
import { FileStoreModule, LocalFileStore } from '@domain/file-store';
import { Module } from '@nestjs/common';
import { JWTModule } from '@utils/jwt';
import { GitLFSBatchService } from './git-lfs-batch.service';
import { GitLFSJWT } from './git-lfs-jwt.schema';
import { GitLFSController } from './git-lfs.controller';
import { GitLFSService } from './git-lfs.service';
import { SFTPFileStore } from '@domain/file-store/sftp-file-store';

@Module({
  imports: [
    FileStoreModule.registerAsync({
      inject: [StoreConfig],
      useFactory: (localStoreConfig: StoreConfig) => {
        if (localStoreConfig.storeSSHConfig) {
          return new SFTPFileStore(localStoreConfig);
        }
        return new LocalFileStore(localStoreConfig);
      },
    }),
    JWTModule.registerAsync(GitLFSJWT, {
      inject: [LFSConfig],
      useFactory: (lfsConfig: LFSConfig) => {
        return {
          secret: lfsConfig.jwtSecret,
          signOptions: { expiresIn: lfsConfig.batchExpiry },
        };
      },
    }),
  ],
  controllers: [GitLFSController],
  providers: [GitLFSService, GitLFSBatchService],
})
export class GitLFSModule {}
