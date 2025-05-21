import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { AppConfig } from '@common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const appConfig = app.get(AppConfig);
  await app.listen(appConfig.port);
}

bootstrap();
