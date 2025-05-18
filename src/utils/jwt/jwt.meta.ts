import { ClassType } from '@utils/types';

export const JWT_MODULE_OPTIONS = 'JWT_MODULE_OPTIONS';
export const JWT_MODULE = 'JWT_MODULE';

export const getJWTModuleKey = <T>(target: ClassType<T>) => {
  return `${JWT_MODULE}:${target.name}`;
};
