import { Injectable, mixin, Type } from '@nestjs/common';
import { DataSource, ObjectLiteral, Repository } from 'typeorm';

export const RepositoryType = <T extends ObjectLiteral>(
  Target: Type<T>,
): Type<Repository<T>> => {
  @Injectable()
  class RepositoryMixin extends Repository<T> {
    constructor(private readonly dataSource: DataSource) {
      super(Target, dataSource.createEntityManager());
    }
  }

  return mixin(RepositoryMixin);
};

export const HasId = <T extends { id: string }>(target: T | string) => {
  const id = typeof target === 'string' ? target : target.id;
  return { id };
};
