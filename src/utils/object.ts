export function objectMap<T extends Record<string, any>>(obj: T, fn: (value: T[keyof T], key: keyof T) => any) {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [
      key,
      fn(
        value,
        key,
      ),
    ]),
  );
}
