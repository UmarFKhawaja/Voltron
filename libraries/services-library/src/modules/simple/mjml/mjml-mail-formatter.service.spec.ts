import { Test, TestingModule } from '@nestjs/testing';
import { MJMLMailFormatterService } from './mjml-mail-formatter.service';

describe('MJMLMailFormatterService', () => {
  let service: MJMLMailFormatterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MJMLMailFormatterService]
    }).compile();

    service = module.get<MJMLMailFormatterService>(MJMLMailFormatterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
