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
  options: { staticServer?: FoxpageStaticOptions } = { staticServer: { enable: true } },
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

    const body = await handler({ request: ctx.request, response: ctx.response, cookies: ctx.cookies });
    if (body) {
      ctx.body = body;
    }

    await _next();
  };
};

export default foxpageRequestHandler;
