export type Nil = null | undefined;

export type Nilable<T> = T | Nil;

export type MaybePromise<T> = T | Promise<T>;

export type MaybeArray<T> = T | T[];

export type EmptyObject = Record<string, never>;

export type KeysOfType<From, ValueType> = {
  [K in keyof From]: From[K] extends ValueType ? K : never;
}[keyof From];

/**
 * 클래스 생성자 타입
 *
 * @see https://stackoverflow.com/questions/39392853/is-there-a-type-for-class-in-typescript-and-does-any-include-it
 */
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export interface ClassType<T, A extends any[] = any[]> extends Function {
  new (...args: A): T;
}
