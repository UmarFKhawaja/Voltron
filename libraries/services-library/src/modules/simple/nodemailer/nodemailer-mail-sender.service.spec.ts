import { Test, TestingModule } from '@nestjs/testing';
import { NodemailerMailSenderService } from './nodemailer-mail-sender.service';

describe('NodemailerMailSenderService', () => {
  let service: NodemailerMailSenderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NodemailerMailSenderService]
    }).compile();

    service = module.get<NodemailerMailSenderService>(NodemailerMailSenderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
