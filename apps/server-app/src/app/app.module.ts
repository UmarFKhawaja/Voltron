import { Module } from '@nestjs/common';
import { AuthModule } from '../modules/auth/auth.module';
import { ProfileModule } from '../modules/profile/profile.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [AuthModule, ProfileModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {
}
