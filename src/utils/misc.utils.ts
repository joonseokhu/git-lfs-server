import { Nil, Nilable } from './types';

export const throwIfFalsy =
  (error: Error) =>
  <T>(value: T): T => {
    if (value) return value;
    throw error;
  };

export const throwIfNil =
  (error: Error) =>
  <T>(value: Nilable<T>): T => {
    if (value !== null && value !== undefined) return value;
    throw error;
  };

export const isNotNil = <T>(value: Nilable<T>): value is T => {
  return value !== null && value !== undefined;
};

export const isNil = <T>(value: Nilable<T>): value is Nil => {
  return value === null || value === undefined;
};

export const parseCamelCase = (value: string) => {
  const words = value.match(/([A-Z]+(?=[A-Z][a-z])|[A-Z]?[a-z]+)/g) ?? [];
  return words.map((str: string) => str.toLowerCase());
};

// export const wait = (time = 0) => {
//   return new Promise((resolve) => setTimeout(() => resolve(time), time));
// };
