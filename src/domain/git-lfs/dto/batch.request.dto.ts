import { DtoProp } from '@utils';

export enum BatchOperation {
  Download = 'download',
  Upload = 'upload',
  Verify = 'verify',
}
export enum BatchTransfer {
  Basic = 'basic',
}

export class BatchRequestObject {
  @DtoProp()
  oid: string;

  @DtoProp()
  size: number;
}

export class BatchRequest {
  @DtoProp('', () => BatchOperation)
  operation: BatchOperation;

  @DtoProp('', () => String)
  transfers: string[] = [];

  @DtoProp('', () => BatchRequestObject)
  objects: BatchRequestObject[];
}
