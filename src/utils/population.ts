import lodash from 'lodash';
import { KeysOfType, MaybePromise, Nil } from './types';

type Keyable = string | number | symbol;

type GetKey<T> = KeysOfType<T, Keyable> | ((item: T) => Keyable);

const getKey = <T>(item: T, getter: GetKey<T>): Keyable | undefined => {
  const key =
    typeof getter === 'function' ? getter(item) : (item[getter] as Keyable);
  if (['string', 'number', 'symbol'].includes(typeof key)) {
    return key;
  }
  return undefined;
};

const isNotNil = <T>(value: T | Nil): value is T => {
  return value !== null && value !== undefined;
};

export class Populate<T> extends Promise<T[]> {
  static get [Symbol.species]() {
    return Promise;
  }

  static from<T>(items: T[]) {
    return new Populate<T>((resolve) => resolve(items));
  }

  chain<Next>(callback: (prev: T[]) => MaybePromise<Next[]>) {
    return new Populate<Next>((resolve, reject) => {
      this.then((prev) => callback(prev))
        .then((next) => resolve(next))
        .catch(reject);
    });
  }

  filter(callback: (prev: T, index: number) => MaybePromise<unknown>) {
    return this.chain(async (prev) => {
      const flags = await Promise.all(prev.map(callback));
      return prev.filter((_, i) => flags[i]);
    });
  }

  map<Next>(callback: (prev: T, index: number) => MaybePromise<Next>) {
    return this.chain(async (prev) => {
      return Promise.all(prev.map(callback));
    });
  }

  joinMany<Key extends string, A>(
    key: Key,
    fetchItems: (keys: Keyable[]) => MaybePromise<A[]>,
    options: { localKey: GetKey<T>; remoteKey: GetKey<A> },
  ): Populate<T & { [key in Key]: A[] }> {
    return this.chain(async (prev) => {
      const localKeys = prev
        .map((item) => getKey(item, options.localKey))
        .filter(isNotNil);
      const extraItems = await Promise.resolve()
        .then(() => fetchItems(localKeys))
        .then((items) => lodash.groupBy(items, options.remoteKey));
      return prev.map((item) => {
        const localKey = getKey(item, options.localKey);
        const eItems = localKeys ? (extraItems[String(localKey)] ?? []) : [];
        return { ...item, [key]: eItems } as T & { [key in Key]: A[] };
      });
    });
  }

  joinOne<Key extends string, A>(
    key: Key,
    fetchItems: (keys: Keyable[]) => MaybePromise<A[]>,
    options: { localKey: GetKey<T>; remoteKey: GetKey<A> },
  ) {
    return this.joinMany(key, fetchItems, options).map((item) => {
      const foundE = item[key];
      return foundE.length
        ? { ...item, [key]: foundE[0] }
        : { ...item, [key]: undefined };
    });
  }
}
