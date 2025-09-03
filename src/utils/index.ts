export function update<T extends Record<string, any>>(
  obj: T,
  path: string | string[],
  value: any
): T {
  path = typeof path === 'string' ? [path] : path;

  if (path.length === 0) return obj;
  const [key, ...rest] = path;
  return {
    ...obj,
    [key]: rest.length > 0
      ? update(obj[key] ?? {}, rest, value)
      : value,
  };
}

export const get = (obj: any, path: string, callback?: any) => {
  const keys = path.split('.');
  let anchor: any = obj;

  for (let i = 0; i < keys.length; i++) {
    anchor = anchor[keys[i]];

    if (anchor === undefined) {
      return callback ?? undefined;
    }
  }

  return anchor;
};