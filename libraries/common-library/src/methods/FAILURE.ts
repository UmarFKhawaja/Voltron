import { Result } from '../types';

export function FAILURE<T>(message: string | Error): Result<T> {
  if (message instanceof Error) {
    return {
      success: false,
      error: {
        message: message.message
      }
    };
  }

  return {
    success: false,
    error: {
      message
    }
  };
}
