import { fromPairs } from 'lodash';

import { Context } from '@foxpage/foxpage-types';

type PickContext<K extends keyof Context> = Partial<Pick<Context, K>>;

export const getURLQueryVar = (ctx: PickContext<'URL'> = {}) => {
  const URL = ctx && ctx.URL;
  if (!URL || !URL.searchParams) {
    return {};
  }

  // proxy searchParams
  const searchParamsProxy = new Proxy(URL.searchParams, {
    get(target, key, receiver) {
      if (key === 'toJSON') {
        return () => fromPairs([...target.entries()]);
      }
      if (typeof key === 'string') {
        return target.get(key);
      }
      return Reflect.get(target, key, receiver);
    },
    has(t, k) {
      if (typeof k === 'string') {
        return t.has(k);
      }
      return Reflect.has(t, k);
    },
    ownKeys(t) {
      return [...t.keys()];
    },
  });

  return searchParamsProxy;
};
