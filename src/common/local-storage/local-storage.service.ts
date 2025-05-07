import { User } from '@domain/user/user.entity';
import { InjectableProxy } from 'nestjs-cls';
import { InternalServerError, UnauthorizedError } from '../error';

/** 요청 그 자체에 대한 정보 */
export interface RequestMeta {
  time: Date;
  id: string;
  ip: string;
  userAgent: string;
  sessionId: string;
}

@InjectableProxy()
export class LocalStorage {
  /** 요청 그 자체에 대한 정보 */
  requestMeta?: RequestMeta;

  getRequestMeta() {
    if (this.requestMeta) return this.requestMeta;
    throw new InternalServerError('Context not initialized');
  }

  /** 로그인된 상태의 유저 */
  user?: User;

  getUser() {
    if (this.user) return this.user;
    throw UnauthorizedError.needsToBeUser();
  }
}
