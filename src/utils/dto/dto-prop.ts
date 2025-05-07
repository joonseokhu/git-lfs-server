/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { applyDecorators, Type as ClassType } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Type as DefineType, Expose, Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { dayjs } from '@utils/dayjs';
import { RESPONSE_TYPE } from './constants';

const DTO_CLASS_KEY = 'DTO_CLASS';

export const DtoProp = (
  description?: string,
  GetType?: () => ClassType | Record<string, string | number>,
): PropertyDecorator => {
  return (target, propertyKey) => {
    const TargetClass = target.constructor;
    const path = `${TargetClass.name}.${String(propertyKey)}`;

    // 멤버가 속한 클래스에 DTO_CLASS 메타데이터 마킹.
    // 해당 클래스가 상위클래스에서 멤버의 타입으로 사용될 경우, 멤버의 타입이 DTO 클래스임을 알 수 있도록 함
    Reflect.defineMetadata(DTO_CLASS_KEY, true, TargetClass);

    // 컴파일러에서 처리해준 기본 타입정보. 원시타입일때만 사용가능
    const DesignType = Reflect.getMetadata('design:type', target, propertyKey);
    // 배열타입인지 여부
    const isArray = DesignType === Array;

    // 컴파일러에서 처리해준 타입정보가 없거나 부족한 경우, 데코레이터에 타입정보 입력이 필수
    if ([Array, Object, null, undefined].includes(DesignType) && !GetType) {
      throw new Error(`"${path}"의 타입 지정 필요`);
    }

    // 입력된 타입정보가 객체인 경우 enum 리터럴을 입력한 것으로 간주
    const isEnum = GetType && typeof GetType() === 'object';
    // 기본타입정보와 입력된 타입정보를 토대로 최종 타입정보를 결정
    const GetTargetType = (() => {
      if (isEnum) return () => String;
      return GetType ?? (() => DesignType);
    })();
    const TargetType = GetTargetType();
    // enum 타입일 경우, enum 리터럴을 배열로 변환
    const enumValues = isEnum ? Object.values(GetType()) : [];
    // 멤버 타입에 DTO_CLASS 메타데이터가 있을경우, 해당 멤버는 DTO 클래스(즉, 일반객체) 임을 의미
    const isDtoClass = !!Reflect.getMetadata(DTO_CLASS_KEY, TargetType);

    // 타입정보를 토대로 밸리데이션 데코레이터를 적용
    if (isArray) {
      IsArray()(target, propertyKey);
    }
    if (isEnum) {
      IsEnum(enumValues, { each: isArray })(target, propertyKey);
    }
    if (TargetType === Number) {
      IsNumber({ allowNaN: false }, { each: isArray })(target, propertyKey);
    }
    if (TargetType === String) {
      IsString({ each: isArray })(target, propertyKey);
    }
    if (TargetType === Boolean) {
      IsBoolean({ each: isArray })(target, propertyKey);
    }
    if (TargetType === Date) {
      Transform(
        ({ value }) => (value instanceof Date ? dayjs(value).format() : value),
        { groups: [RESPONSE_TYPE] },
      )(target, propertyKey);
      IsDate({ each: isArray })(target, propertyKey);
    }

    // DTO 클래스일 경우, 하위 멤버도 밸리데이션 하도록 처리
    if (isDtoClass) {
      IsObject({ each: isArray })(target, propertyKey);
      ValidateNested({ each: isArray })(target, propertyKey);
    }

    // 공용으로 적용해야할 데코레이터들을 적용
    return applyDecorators(
      // class-transformer 데코레이터 적용
      Expose(),
      DefineType(GetTargetType),
      // swagger 데코레이터 적용
      ApiProperty({
        type: TargetType,
        enum: isEnum ? enumValues : undefined,
        isArray,
        description,
      }),
    )(target, propertyKey);
  };
};

DtoProp.Optional = (
  description?: string,
  GetType?: () => ClassType | Record<string, string | number>,
) => {
  return applyDecorators(
    IsOptional(),
    ApiProperty({ required: false }),
    DtoProp(description, GetType),
  );
};
