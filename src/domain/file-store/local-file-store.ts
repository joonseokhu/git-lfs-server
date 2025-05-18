import { StoreConfig, NotFoundError } from '@common';
import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';
import { FileStore } from './file-store.abstract';

export class LocalFileStore implements FileStore {
  constructor(private readonly storeConfig: StoreConfig) {}

  private getPath(user: string, repo: string, oid: string): string {
    return path.join(this.storeConfig.storeDirectory, user, repo, oid);
  }

  put(
    user: string,
    repo: string,
    oid: string,
    stream: Readable,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const filePath = this.getPath(user, repo, oid);
      const writeStream = fs.createWriteStream(filePath, 'utf8');

      return stream
        .pipe(writeStream)
        .on('finish', () => resolve())
        .on('error', (err) => reject(err));
    });
  }

  async get(user: string, repo: string, oid: string): Promise<fs.ReadStream> {
    const filePath = this.getPath(user, repo, oid);
    await this.getSize(user, repo, oid);

    return new Promise<fs.ReadStream>((resolve, reject) => {
      const readStream = fs.createReadStream(filePath, 'utf8');

      return readStream
        .on('open', () => resolve(readStream))
        .on('error', (err) => reject(err));
    });
  }

  exists(user: string, repo: string, oid: string): Promise<boolean> {
    const filePath = this.getPath(user, repo, oid);
    return new Promise<boolean>((resolve, reject) => {
      return fs.stat(filePath, (err) => {
        if (!err) return resolve(true);
        if (err.code === 'ENOENT') return resolve(false);
        return reject(err);
      });
    });
  }

  getSize(user: string, repo: string, oid: string): Promise<number> {
    const filePath = this.getPath(user, repo, oid);

    return new Promise<number>((resolve, reject) => {
      return fs.stat(filePath, (err, stats) => {
        if (!err) return resolve(Number(stats.size));
        if (err.code === 'ENOENT') {
          return reject(NotFoundError.create(filePath));
        }
        return reject(err);
      });
    });
  }
}
