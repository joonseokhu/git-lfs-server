import { DtoProp } from '@utils';

export enum BatchOperation {
  Download = 'download',
  Upload = 'upload',
  Verify = 'verify',
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

  @DtoProp('', () => BatchRequestObject)
  objects: BatchRequestObject[];
}
