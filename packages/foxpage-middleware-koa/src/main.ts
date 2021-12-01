import { Middleware } from 'koa';

import { routerHandler } from '@foxpage/foxpage-node-sdk';

const foxpageRequestHandler = (): Middleware => {
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
