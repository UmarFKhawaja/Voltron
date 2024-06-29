import { Test, TestingModule } from '@nestjs/testing';
import { AuthDisconnectController } from './auth-disconnect.controller';

describe('DisconnectController', () => {
  let controller: AuthDisconnectController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthDisconnectController]
    }).compile();

    controller = module.get<AuthDisconnectController>(AuthDisconnectController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
