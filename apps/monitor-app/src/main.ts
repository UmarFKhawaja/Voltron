import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';

  app.setGlobalPrefix(globalPrefix);

  const port = process.env.PORT || 2180;

  await app.listen(port);

  Logger.log(`🚀 Application is running on http://localhost:${port}/${globalPrefix}`);
}

bootstrap().then().catch((error: unknown) => {
  const { message, stack } = error as Error;

  Logger.error(message, stack);
});
