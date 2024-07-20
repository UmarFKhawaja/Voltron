import { Test } from '@nestjs/testing';
import { AppService } from './app.service';

describe('AppService', () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let service: AppService;

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      providers: [AppService]
    }).compile();

    service = app.get<AppService>(AppService);
  });
});
