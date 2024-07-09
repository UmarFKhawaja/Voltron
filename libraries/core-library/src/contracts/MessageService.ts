import { Task } from '../types';

export interface MessageService {
  watchForMessages(handleTask: (task: Task) => Promise<void>): Promise<void>;
}
