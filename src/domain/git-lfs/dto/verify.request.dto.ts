import { DtoProp } from '@utils';

export class VerifyRequest {
  @DtoProp()
  oid: string;

  @DtoProp()
  size: number;
}
