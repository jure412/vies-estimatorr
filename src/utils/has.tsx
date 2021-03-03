export function has<T>(value: T): value is NonNullable<T> {
  return value != null;
}
