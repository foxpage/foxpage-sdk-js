export type GetRecordType<T, D = any> = T extends { [key: string]: infer R } ? R : D;

export type PickKeyByValue<T, V = string | number> = { [P in keyof T]: T[P] extends V ? P : never }[keyof T];

export function indexArray<T, K extends PickKeyByValue<T>>(
  array: T[],
  prop: K | ((item: T) => string),
): Record<string, T> {
  const map: Record<string, T> = {};
  for (let index = 0; index < array.length; index++) {
    const item = array[index];
    const key: any = typeof prop === 'function' ? prop(item) : item[prop];
    if (key && map[key] === undefined) {
      map[key] = item;
    }
  }
  return map;
}

export function eachObject<S extends Record<string, any>, U = any>(
  source: S,
  cb: (val: GetRecordType<S>, key: string) => U,
): void {
  Object.keys(source).forEach(key => {
    cb((source as any)[key], key);
  });
}

export function mapObject<S extends Record<string, any>, U = any>(
  source: S,
  cb: (val: GetRecordType<S>) => U,
): { [P in keyof S]: U } {
  const target: any = {};
  Object.keys(source).forEach(key => {
    const res = cb((source as any)[key]);
    target[key] = res;
  });
  return target;
}
