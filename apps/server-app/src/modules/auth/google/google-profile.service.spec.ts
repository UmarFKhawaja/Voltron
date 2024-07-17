import { Test, TestingModule } from '@nestjs/testing';
import { AuthGoogleProfileService } from './google-profile.service';

describe('AuthGoogleProfileService', () => {
  let service: AuthGoogleProfileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthGoogleProfileService]
    }).compile();

    service = module.get<AuthGoogleProfileService>(AuthGoogleProfileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
