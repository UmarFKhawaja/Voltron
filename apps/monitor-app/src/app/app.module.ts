import { Module } from '@nestjs/common';
import { RedisModule } from '@voltron/data-library';
import { SimpleModule } from '../modules';

@Module({
  imports: [
    RedisModule,
    SimpleModule
  ]
})
export class AppModule {
}
