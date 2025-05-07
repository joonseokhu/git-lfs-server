// import { applyDecorators, Inject, Type } from '@nestjs/common';
// import {
//   Aspect,
//   createDecorator,
//   LazyDecorator,
//   WrapParams,
// } from '@toss/nestjs-aop';
// import { LRUCache } from 'lru-cache';
// import { CacheOptions } from './types';
// import { ReflectMetadata } from '@utils/reflect-metadata';

// const CACHE_DECORATOR = Symbol('CACHE_DECORATOR');

// @Aspect(CACHE_DECORATOR)
// export class CacheDecorator implements LazyDecorator<any, CacheOptions> {
//   constructor(
//     @Inject(LRUCache)
//     private readonly cache: LRUCache<any, any>,
//   ) {}

//   wrap({ method, metadata: options }: WrapParams<any, CacheOptions>) {
//     // return (...args: any) => {
//     //   let cachedValue = this.cache.get(...args);
//     //   if (!cachedValue) {
//     //     cachedValue = method(...args);
//     //     this.cache.set(cachedValue, ...args);
//     //   }
//     //   return cachedValue;
//     // };
//   }
// }

// export const Cached = (options: CacheOptions) => {
//   return applyDecorators(
//     createDecorator(CACHE_DECORATOR, options),
//     ReflectMetadata.update('abc', () => options),
//   );
// };

// /**
//  * 캐시를 무효화하는 데코레이터
//  * @param TargetClass 캐시를 무효화할 클래스
//  * @param method 캐시를 무효화할 메서드
//  * @returns
//  */
// export const Invalidates = <T, K extends keyof T>(
//   TargetClass: Type<T>,
//   method: K,
// ) => {
//   return createDecorator(CACHE_DECORATOR, {});
// };
