import { Test } from '@nestjs/testing';
import { TaskService } from './task.service';

describe('TaskService', () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let service: TaskService;

  beforeAll(async () => {
    const task = await Test.createTestingModule({
      providers: [TaskService]
    }).compile();

    service = task.get<TaskService>(TaskService);
  });
});
