import { Test, TestingModule } from '@nestjs/testing';
import { AuthRegisterController } from './auth-register.controller';

describe('RegisterController', () => {
  let controller: AuthRegisterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthRegisterController]
    }).compile();

    controller = module.get<AuthRegisterController>(AuthRegisterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
