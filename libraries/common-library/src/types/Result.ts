export type Result<T> =
  | SuccessResult<T>
  | FailureResult;

export interface SuccessResult<T> {
  success: true;
  data: T;
}

export interface FailureResult {
  success: false;
  error: {
    message: string;
  };
}
