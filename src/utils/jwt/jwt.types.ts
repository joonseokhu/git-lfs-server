import jwt from 'jsonwebtoken';

export interface JWTModuleOptions {
  secret: string | Buffer;
  signOptions?: jwt.SignOptions;
  verifyOptions?: jwt.VerifyOptions;
  decodeOptions?: jwt.DecodeOptions;
}
