import { applyDecorators, Type } from '@nestjs/common';
import { ReflectMetadata } from '@utils/reflect-metadata';
import { Transform } from 'class-transformer';
import { DtoProp } from './dto-prop';
import { RESPONSE_TYPE } from './constants';

/** 해당 API 엔드포인트의 응답 타입을 지정 */
export const ResponseType = (TargetType: Type | false): MethodDecorator => {
  return ReflectMetadata.update(RESPONSE_TYPE, () => TargetType);
};

/** 응답시 해당 필드 마스킹 처리 */
export const Redact = (value: unknown = undefined): PropertyDecorator => {
  return applyDecorators(Transform(() => value, { groups: [RESPONSE_TYPE] }));
};

export interface ListedType<T> {
  items: T[];
  total: number;
}

export const Listed = <T>(TargetType: Type<T>): Type<ListedType<T>> => {
  class ListedType<T> {
    @DtoProp('아이템 목록', () => TargetType)
    items: T[];

    @DtoProp()
    total: number;
  }

  Object.defineProperty(ListedType, 'name', {
    value: `Listed${TargetType.name}`,
  });

  return ListedType;
};
