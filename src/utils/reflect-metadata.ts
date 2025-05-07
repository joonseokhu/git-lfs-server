/* eslint-disable @typescript-eslint/no-unsafe-function-type */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import 'reflect-metadata';
import lodash from 'lodash';
import { isNotNil } from './misc.utils';

type Key = string | symbol;

/** reflect-metadata 처리 일관성을 위한 유틸 */
export class ReflectMetadata {
  private constructor(
    public readonly target: object,
    public readonly propertyKey?: Key,
  ) {}

  /** 클래스에 대한 인스턴스를 생성한다 */
  static forClass(target: Function) {
    return new ReflectMetadata(target);
  }

  /** 프로퍼티에 대한 인스턴스를 생성한다 */
  static forProperty(target: object, propertyKey: Key) {
    return new ReflectMetadata(target, propertyKey);
  }

  /** 메서드에 대한 인스턴스를 생성한다 */
  static forMethod(target: object, propertyKey: Key) {
    return new ReflectMetadata(target, propertyKey);
  }

  /** 클래스와 멤버에 대한 인스턴스를 생성한다 */
  static forBoth(
    target: object,
    propertyKey: Key,
  ): [ReflectMetadata, ReflectMetadata] {
    return [
      ReflectMetadata.forClass(target.constructor),
      ReflectMetadata.forMethod(target, propertyKey),
    ];
  }

  static update<T>(key: Key, func: (metadata?: T) => T) {
    return (target: any, propertyKey?: Key) => {
      const meta = propertyKey
        ? ReflectMetadata.forProperty(target, propertyKey)
        : ReflectMetadata.forClass(target);
      meta.update<T>(key, func);
    };
  }

  get targetName() {
    return [this.target.constructor.name, this.propertyKey]
      .filter(Boolean)
      .join('.');
  }

  /** metadata 키 목록을 가져온다. */
  keys(): Key[] {
    return this.propertyKey
      ? Reflect.getMetadataKeys(this.target, this.propertyKey)
      : Reflect.getMetadataKeys(this.target);
  }

  /** metadata 값을 가져온다. */
  get<T>(key: Key): T | undefined;
  get<T>(key: Key, defaultValue: T): T;
  get<T>(key: Key, defaultValue?: T): T | undefined {
    const found = this.propertyKey
      ? Reflect.getMetadata(key, this.target, this.propertyKey)
      : Reflect.getMetadata(key, this.target);
    return found ?? defaultValue;
  }

  getOrThrow<T>(key: Key, error?: Error): T {
    const found = this.get<T>(key);
    if (isNotNil(found)) return found;
    if (error) throw error;
    throw new Error(
      `Metadata '${String(key)}' is not defined for '${this.targetName}'`,
    );
  }

  /** metadata 값을 설정한다 */
  set<T>(key: Key, value: T) {
    return this.propertyKey
      ? Reflect.defineMetadata(key, value, this.target, this.propertyKey)
      : Reflect.defineMetadata(key, value, this.target);
  }

  /** metadata 값을 가져온다. 없을 경우, 기본값을 설정한다. */
  once<T>(key: Key, getter: () => T): T {
    const found = this.get<T>(key);
    if (found) return found;
    const value = getter();
    this.set(key, value);
    return value;
  }

  /** metadata 값을 기존값을 대체하면서 설정한다 */
  update<T>(key: Key, update: (metadata?: T) => T) {
    const prev = this.get<T>(key);
    const next = update(prev);
    return this.set(key, next);
  }

  /** 배열 타입의 metadata 값에 새로운 항목을 추가한다 */
  push<T>(key: Key, value: T, unique?: boolean | ((value: T) => string)) {
    return this.update<T[]>(key, (prev = []) => {
      if (!unique) return [...prev, value];
      if (unique === true) return lodash.uniq([...prev, value]);
      return lodash.uniqBy([...prev, value], unique);
    });
  }

  /** 객체 타입의 metadata 값에 새로운 항목을 추가한다 */
  merge<T>(key: Key, value: Partial<T>) {
    return this.update<T>(key, (prev = {} as T) => ({ ...prev, ...value }));
  }
}
