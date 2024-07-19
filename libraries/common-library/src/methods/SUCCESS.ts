import { Result } from '../types';

export function SUCCESS<T>(data: T): Result<T> {
  return {
    success: true,
    data
  };
}
