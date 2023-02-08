import { Content, Route } from '@foxpage/foxpage-types';

import { NotFoundAppError, NotFoundDSLError, NotMatchRouterError, ParseDSLError } from '../errors';
import { appTask, contextTask, pageTask, parseTask, renderTask, routerTask } from '../task';

import { FoxpageRequestOptions } from './interface';

/**
 * request handler
 * @returns html
 */
export const routerHandler = () => async (opt: FoxpageRequestOptions) => {
  if (!opt.request?.URL) {
    return;
  }
  const { URL } = opt.request;
  const { pathname = '' } = URL;

  // ignore assets
  if (/\.(js|css|json|svg|png|webp|jpe?g|woff)$/.test(pathname)) {
    return null;
  }

  // get app
  const appInfo = appTask(pathname);
  if (!appInfo) {
    throw new NotFoundAppError(pathname);
  }

  const { app, matchedRoute } = appInfo;

  // init renderContext task
  const ctx = await contextTask(app, opt);
  ctx.matchedRoute = matchedRoute;

  // get content
  const content = await routerTask(app, ctx);
  if (!content) {
    throw new NotMatchRouterError(pathname, URL.href);
  }

  const pageId = (content as Content).id;
  // check page route
  if (!pageId) {
    // dispatch
    const result = await (content as Route).action(ctx);
    return result;
  }

  // get page
  const page = await pageTask(pageId, app, ctx);
  if (!page) {
    throw new NotFoundDSLError(pageId);
  }

  // parse page
  const { page: parsedPage, ctx: context } = await parseTask(page, ctx);
  if (!parsedPage.schemas) {
    throw new ParseDSLError(new Error('parsedPage.schemas is empty'), ctx.origin);
  }

  // render task
  const html = await renderTask(parsedPage, context);
  return { html, contextValue: context };
};
