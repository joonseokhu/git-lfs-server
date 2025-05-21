import ssh from 'ssh2';
import path from 'path';
import { Readable } from 'stream';
import { StoreConfig } from '@common';
import { FileStore } from './file-store.abstract';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SFTPFileStore implements FileStore {
  constructor(private readonly storeConfig: StoreConfig) {}

  private getClient<T>(callback: (sftp: ssh.SFTPWrapper) => Promise<T>) {
    const conn = new ssh.Client();

    return new Promise<T>((resolve, reject) => {
      if (!this.storeConfig.storeSSHConfig) {
        throw new Error('SFTP client is not configured');
      }
      conn.on('ready', () => {
        conn.sftp((err, sftp) => {
          if (err) {
            conn.end();
            return reject(err);
          }

          callback(sftp)
            .then((result) => resolve(result))
            .catch((error: Error) => reject(error))
            .finally(() => conn.end());
        });
      });

      conn.on('error', (err) => {
        conn.end();
        reject(err);
      });

      conn.connect(this.storeConfig.storeSSHConfig);
    });
  }

  private getPath(user: string, repo: string, oid: string): string {
    return path.join(this.storeConfig.storeDirectory, user, repo, oid);
  }

  async put(
    user: string,
    repo: string,
    oid: string,
    stream: Readable,
  ): Promise<void> {
    const filePath = this.getPath(user, repo, oid);

    return this.getClient(async (sftp) => {
      return new Promise((resolve, reject) => {
        const writeStream = sftp.createWriteStream(filePath);
        writeStream.on('finish', () => resolve());
        writeStream.on('error', (err: Error) => reject(err));
        stream.pipe(writeStream);
      });
    });
  }

  async get(user: string, repo: string, oid: string): Promise<Readable> {
    const filePath = this.getPath(user, repo, oid);

    return this.getClient(async (sftp) => {
      return new Promise((resolve, reject) => {
        const readStream = sftp.createReadStream(filePath);
        readStream.on('open', () => resolve(readStream));
        readStream.on('error', (err: Error) => reject(err));
      });
    });
  }

  async exists(user: string, repo: string, oid: string): Promise<boolean> {
    const filePath = this.getPath(user, repo, oid);

    return this.getClient(async (sftp) => {
      return new Promise((resolve) => {
        sftp.stat(filePath, (err, stats) => {
          if (err) throw err;
          if (stats.isFile()) return resolve(true);
          return resolve(false);
        });
      });
    });
  }

  async getSize(user: string, repo: string, oid: string): Promise<number> {
    const filePath = this.getPath(user, repo, oid);

    return this.getClient(async (sftp) => {
      return new Promise((resolve, reject) => {
        sftp.stat(filePath, (err, stats) => {
          if (err) throw err;
          if (!stats.isFile()) return reject(new Error('Not a file'));
          return resolve(Number(stats.size));
        });
      });
    });
  }
}
