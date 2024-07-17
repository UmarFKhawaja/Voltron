import { Test, TestingModule } from '@nestjs/testing';
import { AuthURLService } from './url.service';

describe('AuthURLService', () => {
  let service: AuthURLService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthURLService]
    }).compile();

    service = module.get<AuthURLService>(AuthURLService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
