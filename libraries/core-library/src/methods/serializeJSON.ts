export function serializeJSON<T>(value: T): string {
  return JSON.stringify(value, null, 2);
}
