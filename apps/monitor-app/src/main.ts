import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  Logger.log(`🚀 Application is running`);
}

bootstrap().then().catch((error: unknown): void => {
  const { message, stack } = error as Error;

  Logger.error(message, stack);
});
