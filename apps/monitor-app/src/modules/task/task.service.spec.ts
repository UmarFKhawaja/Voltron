import { Test } from '@nestjs/testing';
import { TaskService } from './task.service';

describe('TaskService', () => {
  let service: TaskService;

  beforeAll(async () => {
    const task = await Test.createTestingModule({
      providers: [TaskService]
    }).compile();

    service = task.get<TaskService>(TaskService);
  });
});
