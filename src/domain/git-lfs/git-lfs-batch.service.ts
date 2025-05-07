import { Injectable } from '@nestjs/common';
import { mapAsync } from '@utils';
import {
  BatchOperation,
  BatchRequest,
  BatchRequestObject,
} from './dto/batch.request.dto';
import { GitLFSService } from './git-lfs.service';

@Injectable()
export class GitLFSBatchService {
  constructor(private readonly lfsService: GitLFSService) {}

  uploadObjects(user: string, repo: string, objects: BatchRequestObject[]) {
    return mapAsync(objects, ({ oid, size }) => {
      return this.lfsService.uploadObject(user, repo, oid, size);
    });
  }

  downloadObjects(user: string, repo: string, objects: BatchRequestObject[]) {
    return mapAsync(objects, ({ oid }) => {
      return this.lfsService.downloadObject(user, repo, oid);
    });
  }

  verifyObjects(user: string, repo: string, objects: BatchRequestObject[]) {
    return mapAsync(objects, ({ oid, size }) => {
      return this.lfsService.verifyObject(user, repo, oid, size);
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
