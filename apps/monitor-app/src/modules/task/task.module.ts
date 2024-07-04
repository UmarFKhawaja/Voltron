import { Module } from '@nestjs/common';
import { MongoModule, RedisModule } from '@voltron/data-library';
import { NodemailerModule } from '@voltron/services-library';
import { TaskService } from './task.service';

@Module({
  imports: [
    MongoModule,
    RedisModule,
    NodemailerModule
  ],
  providers: [
    TaskService
  ],
  exports: [
    TaskService
  ]
})
export class TaskModule {
}
