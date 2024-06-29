import { Test, TestingModule } from '@nestjs/testing';
import { AuthAcceptController } from './auth-accept.controller';

describe('AcceptController', () => {
  let controller: AuthAcceptController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthAcceptController]
    }).compile();

    controller = module.get<AuthAcceptController>(AuthAcceptController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
