import { Type } from '@nestjs/common';
import { FindOptionsWhere, FindOptionsWhereProperty } from 'typeorm';

type NotUndefined<T> = T extends undefined ? never : T;
// const isNotUndefined = <T>(value: T): value is NotUndefined<T> => {
//   return value !== undefined;
// };

export class FilterBuilder<Entity, Input> {
  conditions: FindOptionsWhere<Entity>[] = [];

  private constructor(
    private EntityType: Type<Entity>,
    private readonly input: Input,
  ) {}

  static create<Entity, Input>(EntityType: Type<Entity>, input: Input) {
    return new FilterBuilder<Entity, Input>(EntityType, input);
  }

  private addCondition<Key extends keyof Entity>(
    key: Key,
    condition: FindOptionsWhereProperty<NonNullable<Entity[Key]>>,
  ) {
    const next = FilterBuilder.create<Entity, Input>(
      this.EntityType,
      this.input,
    );

    next.conditions = [
      ...this.conditions,
      { [key]: condition } as FindOptionsWhere<Entity>,
    ];

    return next;
  }

  private useWithSameKey<Key extends keyof Input & keyof Entity>(
    key: Key,
    mutate?: (
      value: NotUndefined<Input[Key]>,
    ) => FindOptionsWhereProperty<NonNullable<Entity[Key]>>,
  ) {
    const value = this.input[key];
    if (value === undefined) return this;

    const condition = mutate
      ? mutate(value as NotUndefined<Input[Key]>)
      : (value as FindOptionsWhereProperty<NonNullable<Entity[Key]>>);
    return this.addCondition(key, condition);
  }

  private useWithDifferentKey<
    EntityKey extends keyof Entity,
    InputKey extends keyof Input,
  >(
    entityKey: EntityKey,
    inputKey: InputKey,
    mutate?: (
      value: NotUndefined<Input[InputKey]>,
    ) => FindOptionsWhereProperty<NonNullable<Entity[EntityKey]>>,
  ) {
    const value = this.input[inputKey];
    if (value === undefined) return this;

    const condition = mutate
      ? mutate(this.input[inputKey] as NotUndefined<Input[InputKey]>)
      : (this.input[inputKey] as FindOptionsWhereProperty<
          NonNullable<Entity[EntityKey]>
        >);
    return this.addCondition(entityKey, condition);
  }

  use<Key extends keyof Input & keyof Entity>(
    key: Key,
    mutate?: (
      value: NotUndefined<Input[Key]>,
    ) => FindOptionsWhereProperty<NonNullable<Entity[Key]>>,
  ): typeof this;
  use<EntityKey extends keyof Entity, InputKey extends keyof Input>(
    entityKey: EntityKey,
    inputKey: InputKey,
    mutate?: (
      value: NotUndefined<Input[InputKey]>,
    ) => FindOptionsWhereProperty<NonNullable<Entity[EntityKey]>>,
  ): typeof this;
  use(arg1: any, arg2?: any, arg3?: any) {
    return typeof arg2 === 'function'
      ? this.useWithSameKey(arg1, arg2)
      : this.useWithDifferentKey(arg1, arg2, arg3);
  }

  // use<Key extends keyof Input>(
  //   property: Key,
  //   condition: (value: Input[Key]) => FindOptionsWhereProperty<NonNullable<Entity[P]>>,
  // ): typeof this;
  // use<Key extends keyof Input>(
  //   property: Key,
  //   condition: (value: Input[Key]) => FindOptionsWhereProperty<NonNullable<Entity[P]>>,
  // ): typeof this;
}
