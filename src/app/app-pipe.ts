import { BadRequestError } from '@common';
import { ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';

export const validationExceptionFilter = (
  errors: ValidationError[],
): BadRequestError => {
  console.log('validation error');
  console.log(errors);
  for (const error of errors) {
    if (error.constraints) {
      const [errorMessage] = Object.values(error.constraints);
      return new BadRequestError(errorMessage);
    }
    if (error.children) return validationExceptionFilter(error.children);
  }
  return new BadRequestError('유효성 검사에 실패했습니다.');
};

export const appPipe = new ValidationPipe({
  exceptionFactory: validationExceptionFilter,
  whitelist: true,
  transform: true,
  transformOptions: {
    enableImplicitConversion: true,
  },
});
