import { Test, TestingModule } from '@nestjs/testing';
import { AuthFacebookProfileService } from './facebook-profile.service';

describe('AuthFacebookProfileService', () => {
  let service: AuthFacebookProfileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthFacebookProfileService]
    }).compile();

    service = module.get<AuthFacebookProfileService>(AuthFacebookProfileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
