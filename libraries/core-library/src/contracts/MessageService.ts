import { Task } from '@voltron/core-library';

export interface MessageService {
  watchForMessages(handleTask: (task: Task) => Promise<void>): Promise<void>;
}
