import Koa, { Middleware } from 'koa';

import { routerHandler } from '@foxpage/foxpage-node-sdk';

import { foxpageStaticHandler, FoxpageStaticOptions } from './static';

/**
 * foxpage request handler
 * @param app koa app
 * @param options
 * @returns
 */
export const foxpageRequestHandler = (
  app: Koa,
  options: { staticServer?: FoxpageStaticOptions } = { staticServer: { enable: false } },
): Middleware => {
  if (options.staticServer?.enable) {
    foxpageStaticHandler(app, options.staticServer);
  }

  const handler = routerHandler();

  return async (ctx, next) => {
    let _next = () => {
      _next = () => Promise.resolve();
      return next();
    };

    if (ctx.body) {
      return _next();
    }

    try {
      const result = await handler({ request: ctx.request, response: ctx.response, cookies: ctx.cookies });
      if (typeof result === 'string') {
        ctx.body = result;
      } else if (result?.html) {
        ctx.body = result?.html || 'render empty!';
        ctx.foxpageRendered = result;
      } else {
        ctx.body = result;
      }
    } catch (e) {
      ctx.body = `request failed: ${(e as Error).message} \nstack: ${(e as Error).stack}`;
      ctx.status = (e as any).status || 400;
    }

    await _next();
  };
};

export default foxpageRequestHandler;
