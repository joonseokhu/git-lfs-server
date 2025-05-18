import { DtoProp } from '@utils';
import { BatchOperation } from './dto';

export class GitLFSJWT {
  @DtoProp('', () => BatchOperation)
  action: BatchOperation;

  @DtoProp()
  user: string;

  @DtoProp()
  repo: string;

  @DtoProp.Optional()
  oid?: string;
}
