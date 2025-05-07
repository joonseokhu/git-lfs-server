import { Type } from '@nestjs/common';
import {
  ManyToOne as BaseManyToOne,
  OneToMany as BaseOneToMany,
  RelationOptions,
} from 'typeorm';

export const ManyToOne = <T>(
  Target: () => Type<T>,
  options: RelationOptions = {},
) => {
  return BaseManyToOne(Target, {
    nullable: false,
    createForeignKeyConstraints: false,
    ...options,
  });
};

export const OneToMany = <T>(
  Target: () => Type<T>,
  reverseSide: (t: T) => any,
  options: RelationOptions = {},
) => {
  return BaseOneToMany(Target, reverseSide, {
    nullable: false,
    createForeignKeyConstraints: false,
    ...options,
  });
};
