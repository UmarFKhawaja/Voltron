import { Module } from '@nestjs/common';
import { AuthModule } from '../modules/auth/auth.module';
import { MongoModule } from '../modules/mongo/mongo.module';
import { RedisModule } from '../modules/redis/redis.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [MongoModule, RedisModule, AuthModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {
}
