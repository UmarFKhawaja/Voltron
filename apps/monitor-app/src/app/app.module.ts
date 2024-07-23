import { Module } from '@nestjs/common';
import { RedisModule } from '@voltron/data-library';
import { SimpleModule } from '@voltron/services-library';

@Module({
  imports: [
    RedisModule,
    SimpleModule
  ]
})
export class AppModule {
}
