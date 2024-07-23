import { Task } from '../types';

export interface TaskService {
  handleTask(task: Task): Promise<void>;
}
