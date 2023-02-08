import { createProxyMiddleware, Options } from 'http-proxy-middleware';
import { Middleware } from 'koa';
import kc from 'koa-connect';
//@ts-ignore
import pathToRegexp from 'path-to-regexp';

export type Koa2ProxyMiddlewareConfig = {
  targets: Record<string, Options>;
};

/**
 * koa http proxy middleware
 * add feature: cover target(get from ctx origin)
 * refer: https://www.npmjs.com/package/koa2-proxy-middleware
 * @param options proxy options
 * @returns middleware
 */
const proxy = (options: Koa2ProxyMiddlewareConfig): Middleware => {
  return async function (ctx, next) {
    const { targets = {} } = options;
    const { path } = ctx;
    for (const route of Object.keys(targets)) {
      //@ts-ignore
      if (pathToRegexp(route).test(path)) {
        const opt: Options = Object.assign({}, targets[route], { target: ctx.request.origin }, { logLevel: 'error' });
        const httpProxy = createProxyMiddleware(opt);
        //@ts-ignore
        await kc(httpProxy)(ctx, next);
        break;
      }
    }
    await next();
  };
};

export default proxy;
