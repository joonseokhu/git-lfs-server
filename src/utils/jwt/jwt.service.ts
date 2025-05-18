import { ClassType } from '@utils/types';
import { plainToInstance } from 'class-transformer';
import jwt from 'jsonwebtoken';
import { JWTModuleOptions } from './jwt.types';

export class JWTService<T> {
  constructor(
    private readonly target: ClassType<T>,
    private readonly options: JWTModuleOptions,
  ) {}

  sign(payload: T, options?: jwt.SignOptions): string {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return jwt.sign(payload as any, this.options.secret, {
      ...this.options.signOptions,
      ...options,
    });
  }

  decode(token: string, options?: jwt.DecodeOptions): T {
    const decoded = jwt.decode(token, {
      ...this.options.decodeOptions,
      ...options,
    });
    if (typeof decoded === 'string') {
      throw new Error('Invalid token');
    }
    if (decoded === null) {
      throw new Error('Token expired');
    }
    return plainToInstance(this.target, decoded);
  }

  verify(token: string, options?: jwt.VerifyOptions): T {
    const verified = jwt.verify(token, this.options.secret, {
      ...this.options.verifyOptions,
      ...options,
    });
    if (typeof verified === 'string') {
      throw new Error('Invalid token');
    }
    if (verified === null) {
      throw new Error('Token expired');
    }
    return plainToInstance(this.target, verified.payload);
  }
}
