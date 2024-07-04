export function deserializeJSON<T>(json: string): T {
  return JSON.parse(json) as T;
}
