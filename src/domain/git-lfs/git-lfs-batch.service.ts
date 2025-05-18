import { AppConfig, LFSConfig } from '@common';
import { Injectable } from '@nestjs/common';
import { dayjs, mapAsync } from '@utils';
import { InjectJWT, JWTService } from '@utils/jwt';
import ms from 'ms';
import {
  BatchOperation,
  BatchRequest,
  BatchRequestObject,
} from './dto/batch.request.dto';
import { GitLFSJWT } from './git-lfs-jwt.schema';
import { GitLFSService } from './git-lfs.service';

@Injectable()
export class GitLFSBatchService {
  constructor(
    private readonly lfsService: GitLFSService,
    private readonly lfsConfig: LFSConfig,
    private readonly appConfig: AppConfig,
    @InjectJWT(GitLFSJWT) private readonly jwt: JWTService<GitLFSJWT>,
  ) {}

  getAction(
    user: string,
    repo: string,
    oid: string,
    operation: BatchOperation,
  ) {
    const expiresAt = dayjs()
      .add(ms(this.lfsConfig.batchExpiry), 'ms')
      .toISOString();

    const authHeader = [
      'Bearer',
      this.jwt.sign({ action: operation, user, repo, oid }),
    ].join(' ');

    return {
      href: `${this.appConfig.baseURL}${user}/${repo}/objects/verify`,
      expires_at: expiresAt,
      header: { Authorization: authHeader },
    };
  }

  uploadObjects(user: string, repo: string, objects: BatchRequestObject[]) {
    // const jwt = this.jwt.sign({ action: 'upload' })
    return objects.map(({ oid, size }) => {
      return {
        oid,
        size,
        actions: {
          upload: this.getAction(user, repo, oid, BatchOperation.Upload),
          verify: this.getAction(user, repo, oid, BatchOperation.Verify),
        },
      };
    });
  }

  downloadObjects(user: string, repo: string, objects: BatchRequestObject[]) {
    return mapAsync(objects, async ({ oid, size }) => {
      if (!(await this.lfsService.exists(user, repo, oid))) {
        return {
          oid,
          size,
          error: {
            code: 404,
            message: `Object ${oid} not found`,
          },
        };
      }
      return {
        oid,
        size,
        actions: {
          download: this.getAction(user, repo, oid, BatchOperation.Download),
        },
      };
    });
  }

  verifyObjects(user: string, repo: string, objects: BatchRequestObject[]) {
    return objects.map(({ oid, size }) => {
      return {
        oid,
        size,
        actions: {
          verify: this.getAction(user, repo, oid, BatchOperation.Verify),
        },
      };
    });
  }

  batchObject(user: string, repo: string, batchRequest: BatchRequest) {
    switch (batchRequest.operation) {
      case BatchOperation.Download:
        return this.downloadObjects(user, repo, batchRequest.objects);
      case BatchOperation.Upload:
        return this.uploadObjects(user, repo, batchRequest.objects);
      case BatchOperation.Verify:
        return this.verifyObjects(user, repo, batchRequest.objects);
      default:
        throw new Error('Invalid operation');
    }
  }
}
