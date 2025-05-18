import { Readable } from 'stream';

export abstract class FileStore {
  abstract put(
    user: string,
    repo: string,
    oid: string,
    stream: Readable,
  ): Promise<void>;

  abstract exists(user: string, repo: string, oid: string): Promise<boolean>;

  abstract get(user: string, repo: string, oid: string): Promise<Readable>;

  abstract getSize(user: string, repo: string, oid: string): Promise<number>;
}
