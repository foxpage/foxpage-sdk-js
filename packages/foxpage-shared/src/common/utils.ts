import _, { isEqual } from 'lodash';

type GetRecordType<T, D = unknown> = T extends { [key: string]: infer R } ? R : D;

type PickKeyByValue<T, V = string | number> = { [P in keyof T]: T[P] extends V ? P : never }[keyof T];

export function indexArray<T, K extends PickKeyByValue<T>>(array: T[], prop: K): Record<string, T> {
  return array.reduce((map: Record<string, T>, item) => {
    const key: any = item[prop];
    if (key && map[key] === undefined) {
      map[key] = item;
    }
    return map;
  }, {});
}

export function buildMapFromIterator<T, K extends PickKeyByValue<T, string | number>>(
  iterator: Iterable<T>,
  keyProp: K,
): Map<string, T> {
  const map = new Map<string, T>();
  for (const item of iterator) {
    const key = item[keyProp];
    const strKey = (typeof key === 'string' || typeof key === 'number') && String(key);
    if (strKey && !map.has(strKey)) {
      map.set(String(key), item);
    }
  }
  return map;
}

export function filterObject<S>(source: S, cb: (val: GetRecordType<S>) => boolean): Partial<S> {
  return Object.entries(source)
    .filter(([_, v]) => cb(v))
    .reduce((target, [k, v]) => {
      target[k] = v;
      return target;
    }, {} as any);
}

export function eachObject<S, U>(source: S, cb: (val: GetRecordType<S>, key: string) => U): void {
  return Object.entries(source).forEach(([k, v]) => {
    cb(v, k);
  });
}

export function mapObject<S, U>(
  source: S,
  cb: (val: NonNullable<GetRecordType<S>>, key: string) => U,
  filterNull = false,
): { [P in keyof S]: U } {
  return Object.entries(source).reduce((target, [k, v]) => {
    const res = cb(v, k);
    if (!(filterNull && res === undefined)) {
      target[k] = res;
    }
    return target;
  }, {} as any);
}

export async function mapObjectAsync<S, U>(
  source: S,
  cb: (val: GetRecordType<S>, key: string) => Promise<U>,
): Promise<{ [P in keyof S]: U }> {
  const target: Record<string, any> = {};
  const entries = Object.entries(source);
  const promises = entries.map(([k, v]) =>
    cb(v, k)
      .then(res => (target[k] = res))
      .catch(() => (target[k] = undefined)),
  );
  await Promise.all(promises);
  return target as { [P in keyof S]: U };
}

export function format(str: string, ...params: any[]) {
  const len = params.length;
  let idx = 0;
  let formatted = str.replace(/%[d|s|j|%]/g, matched => {
    if (matched === '%%') {
      return '%';
    }
    if (idx < len) {
      const param = params[idx];
      idx += 1;
      switch (matched) {
        case '%d':
          return String(Number(param));
        case '%s':
          return String(param);
        case '%j':
          return JSON.stringify(param);
      }
    }
    return matched;
  });
  for (; idx < params.length; idx++) {
    const element = params[idx];
    formatted += '\n';
    if (element instanceof Error) {
      formatted += element.stack;
    } else if (typeof element === 'object') {
      try {
        formatted += JSON.stringify(element);
      } catch (_err) {
        formatted += String(element);
      }
    } else {
      formatted += String(element);
    }
  }
  return formatted;
}

export function isNotNill<T>(val: T | undefined | null | false): val is T {
  return val !== undefined && val !== null && val !== false;
}

export type LocaleStyle = 'aa_bb' | 'aa-bb' | 'aa_BB' | 'aa-BB' | 'AA_BB' | 'AA-BB' | 'AA_bb' | 'AA-bb';

export type LocaleWithFormatter = string & { localeFormat: ReturnType<typeof formatLocale> };

/**
 *
 * @param locale locale
 * @param style aa_bb, aa-bb, aa_BB,  aa-BB, AA_BB, AA-BB,  AA_bb,  AA-bb
 */
export const formatLocale = (locale = 'en-US') => {
  const [lang = '', zone = ''] = locale.split(locale.includes('-') ? '-' : '_');
  return (style: LocaleStyle) =>
    style
      .replace('aa', lang.toLowerCase())
      .replace('AA', lang.toUpperCase())
      .replace('bb', zone.toLowerCase())
      .replace('BB', zone.toUpperCase());
};

export const createLocaleHasFormatter = (locale = 'en-US'): LocaleWithFormatter => {
  const str = new String(locale) as LocaleWithFormatter;
  const formatter = formatLocale(locale);
  str.localeFormat = formatter;
  return str;
};

export const diff = <T, K extends PickKeyByValue<T>>(
  oldData: T[],
  newData: T[],
  key: K,
  areEqual: (oldItem: T, newItem: T) => boolean = isEqual,
) => {
  const oldDataMap = indexArray(oldData, key);
  const adds: T[] = [];
  const updates: T[] = [];
  const deletes: T[] = [];

  for (const newItem of newData) {
    const id: string | number = newItem[key] as any;
    const oldItem = oldDataMap[id];
    if (id in oldDataMap) {
      delete oldDataMap[id];
      if (areEqual(oldItem, newItem)) {
        continue;
      } else {
        updates.push(newItem);
      }
    } else {
      adds.push(newItem);
    }
  }

  deletes.push(...Object.values(oldDataMap));

  return {
    adds,
    updates,
    deletes,
  };
};

export function getESModuleExport<T = any>(mod: unknown): { default: T } {
  // esModule
  if (typeof mod === 'object' && mod !== null && (mod as any).__esModule && 'default' in mod) {
    return mod as { default: T };
  }
  return { default: mod as T };
}

export function pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  if (!obj) {
    return {} as Pick<T, K>;
  }
  return keys.reduce((result: Partial<Pick<T, K>>, key: K) => {
    if (key in obj) {
      result[key] = obj[key];
    }
    return result;
  }, {}) as Pick<T, K>;
}

export function omit<T extends Record<string, any>, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
  return _.omit(obj, keys) as Omit<T, K>;
}

export function timeout(promise: Promise<any>, time: number) {
  return Promise.race([
    promise,
    new Promise((_resolve, reject) => {
      setTimeout(() => {
        reject(new Error('timeout'));
      }, time);
    }),
  ]);
}

export function isArray(val: any): val is any[] {
  return Object.prototype.toString.call(val) === '[object Array]';
}
