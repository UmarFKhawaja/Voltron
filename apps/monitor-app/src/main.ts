import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MessageService, TaskService } from '@voltron/core-library';
import { REDIS_CONSTANTS } from '@voltron/data-library';
import { AppModule } from './app/app.module';
import { SIMPLE_CONSTANTS } from './modules';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const messageService: MessageService = app.get<MessageService>(REDIS_CONSTANTS.Symbols.Services.MessageService);
  const taskService: TaskService = app.get<TaskService>(SIMPLE_CONSTANTS.Symbols.Services.TaskService);

  await messageService.watchForMessages(taskService.handleTask.bind(taskService));

  Logger.log(`🚀 Monitor application is running`);
}

bootstrap().then().catch((error: unknown): void => {
  const { message, stack } = error as Error;

  Logger.error(message, stack);
});
