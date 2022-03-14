import { fromPairs } from 'lodash';

import { pick } from '@foxpage/foxpage-shared/lib/common/utils';
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

export const getURLVar = (
  ctx: PickContext<'URL'> = {},
): PickContext<'URL'> & {
  params: Record<string, string>;
  queryParams: Record<string, string>;
  query: Record<string, string>;
} => {
  const URL = ctx && ctx.URL;
  if (!URL) {
    return {} as any;
  }
  // proxy searchParams
  const queryProxy = getURLQueryVar(ctx);

  const urlVar = Object.assign(URL, {
    params: queryProxy,
    query: queryProxy,
    queryParams: queryProxy,
    toJSON() {
      return {
        params: (queryProxy as any)?.toJSON?.() || queryProxy,
        query: (queryProxy as any)?.toJSON?.() || queryProxy,
        queryParams: (queryProxy as any)?.toJSON?.() || queryProxy,
        ...pick(URL, ['origin', 'href', 'protocol', 'host', 'hostname', 'port', 'pathname', 'search', 'hash']),
      };
    },
  });
  return urlVar;
};
