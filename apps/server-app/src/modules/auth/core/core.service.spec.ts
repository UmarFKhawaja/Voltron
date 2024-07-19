import { Test, TestingModule } from '@nestjs/testing';
import { AuthCoreService } from './core.service';

describe('AuthCoreService', () => {
  let service: AuthCoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthCoreService]
    }).compile();

    service = module.get<AuthCoreService>(AuthCoreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
