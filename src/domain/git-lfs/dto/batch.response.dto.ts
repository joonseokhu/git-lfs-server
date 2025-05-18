import { DtoProp } from '@utils';
import { BatchRequestObject, BatchTransfer } from './batch.request.dto';

export class BatchAction {
  @DtoProp()
  href: string;

  // @DtoProp()
  header: Record<string, string>;

  @DtoProp('', () => Date)
  expires_at: Date;
}

export class BatchActions {
  @DtoProp.Optional()
  download?: BatchAction;

  @DtoProp.Optional()
  upload?: BatchAction;

  @DtoProp.Optional()
  verify?: BatchAction;
}

export class SuccessObject extends BatchRequestObject {
  @DtoProp()
  authenticated: boolean;

  @DtoProp()
  actions: BatchActions;
}

export class BatchError {
  @DtoProp()
  code: number;

  @DtoProp()
  message: string;
}

export class FailObject extends BatchRequestObject {
  @DtoProp()
  error: BatchError;
}

export class BatchResponse {
  @DtoProp('', () => BatchTransfer)
  transfer: BatchTransfer = BatchTransfer.Basic;

  // @DtoProp()
  objects: (SuccessObject | FailObject)[];

  @DtoProp()
  hash_algo: string;
}
