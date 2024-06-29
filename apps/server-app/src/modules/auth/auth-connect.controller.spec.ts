import { Test, TestingModule } from '@nestjs/testing';
import { AuthConnectController } from './auth-connect.controller';

describe('ConnectController', () => {
  let controller: AuthConnectController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthConnectController]
    }).compile();

    controller = module.get<AuthConnectController>(AuthConnectController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
