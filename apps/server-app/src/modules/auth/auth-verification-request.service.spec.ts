import { Test, TestingModule } from '@nestjs/testing';
import { AuthVerificationRequestService } from './auth-verification-request.service';

describe('AuthVerificationRequestService', () => {
  let service: AuthVerificationRequestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthVerificationRequestService]
    }).compile();

    service = module.get<AuthVerificationRequestService>(AuthVerificationRequestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
