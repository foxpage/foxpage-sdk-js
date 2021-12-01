import { Context } from '@foxpage/foxpage-types';

import { getURLQueryVar, getURLVar } from './providers';

export type SysVariableProvider<T = any> = (ctx: Partial<Context>) => T;

// TODO: will remove it
type MockedContext = Record<string, any>;

/**
 * request variable
 */
export const reqvar: SysVariableProvider = (ctx: MockedContext) => {
  const requestBody = (ctx.request as any).body || (ctx.req as any).body || ctx.body || {};
  return requestBody.reqvar;
};

/**
 * get request standard URL object
 */
export const urlObj: SysVariableProvider<ReturnType<typeof getURLVar>> = ctx => {
  return getURLVar(ctx);
};

export const urlobj = urlObj;

export const urlQuery: SysVariableProvider = (ctx: MockedContext) => {
  return getURLQueryVar(ctx);
};

export const urlquery = urlQuery;

/**
 * cookies
 */
export const cookie: SysVariableProvider<Record<string, string> | undefined> = (ctx: MockedContext) => {
  if (!ctx || !ctx.cookies) {
    return {};
  }
  const cookies = ctx.cookies;
  const cookiesProxy: Record<string, string> = new Proxy(
    {},
    {
      get(target, key, receiver) {
        if (key === 'toJSON') {
          return () => {
            return ctx.headers?.cookie;
          };
        }
        if (typeof key === 'string') {
          return cookies.get(key);
        }
        return Reflect.get(target, key, receiver);
      },
      set(target, key, value, receiver) {
        if (typeof key === 'string') {
          cookies.set(key, value);
          return true;
        }
        return Reflect.set(target, key, value, receiver);
      },
    },
  );
  return cookiesProxy;
};

/**
 * header
 */
export const header: SysVariableProvider = (ctx: MockedContext) => {
  if (!ctx || !ctx.req || !ctx.res || !ctx.req.headers) {
    return;
  }
  const headerProxy: Record<string, string | string[] | undefined> = new Proxy(ctx.req.headers, {
    set(target, key, value, receiver) {
      if (typeof key === 'string' && ctx.res) {
        ctx.res.setHeader(key, value);
        return true;
      }
      return Reflect.set(target, key, value, receiver);
    },
  });
  return headerProxy;
};
