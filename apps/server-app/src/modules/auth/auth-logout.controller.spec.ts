import { Test, TestingModule } from '@nestjs/testing';
import { AuthLogoutController } from './auth-logout.controller';

describe('AuthLogoutController', () => {
  let controller: AuthLogoutController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthLogoutController]
    }).compile();

    controller = module.get<AuthLogoutController>(AuthLogoutController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
