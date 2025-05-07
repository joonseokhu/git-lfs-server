import { HttpError, NotFoundError } from '@common';
import { FileStore } from '@domain/file-store';
import { Injectable } from '@nestjs/common';
import { Readable } from 'stream';

@Injectable()
export class GitLFSService {
  constructor(private readonly fileStore: FileStore) {}

  async uploadObject(
    user: string,
    repo: string,
    objectId: string,
    requestStream: Readable,
  ) {
    await this.fileStore.put(user, repo, objectId, requestStream);
  }

  async downloadObject(user: string, repo: string, objectId: string) {
    return this.fileStore.get(user, repo, objectId);
  }

  async getSize(user: string, repo: string, objectId: string) {
    return this.fileStore.getSize(user, repo, objectId);
  }

  async verifyObject(
    user: string,
    repo: string,
    objectId: string,
    expectedSize: number,
  ) {
    const size = await this.getSize(user, repo, objectId);
    if (size === null) throw NotFoundError.create(objectId);
    if (size !== expectedSize) throw new HttpError(422, 'Invalid size');
  }
}
