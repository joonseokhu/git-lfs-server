// import { Module } from '@nestjs/common';
// import { LRUCache } from 'lru-cache';
// import { CacheDecorator } from './cache.decorator';

// @Module({
//   providers: [
//     {
//       provide: LRUCache,
//       useFactory: () => {
//         return new LRUCache({
//           maxSize: 10_000,
//           ttl: 1000 * 60 * 60 * 24,
//           sizeCalculation: () => 1,
//           updateAgeOnGet: true,
//         });
//       },
//     },
//     CacheDecorator,
//   ],
// })
// export class CacheModule {}
