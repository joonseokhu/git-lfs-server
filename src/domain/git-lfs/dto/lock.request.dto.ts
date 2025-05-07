import { DtoProp } from '@utils';

export class CreateLockRef {
  @DtoProp()
  name: string;
}

export class CreateLockRequest {
  @DtoProp()
  path: string;

  @DtoProp.Optional()
  ref: CreateLockRef;
}
