import { Content, FoxpageRequestOptions, ParsedDSL, Route } from '@foxpage/foxpage-types';

import { isProd } from '../common';
import { AccessDeniedError, NotFoundAppError, NotFoundDSLError, NotMatchRouterError, ParseDSLError } from '../errors';
import { accessControlTask, appTask, contextTask, pageTask, parseTask, renderTask, routerTask } from '../task';

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
    // is system routes
    const verified = await accessControlTask(app, ctx);
    if (!verified) {
      throw new AccessDeniedError(ctx.URL?.pathname);
    }
    // dispatch
    const result = await (content as Route).action(ctx);
    return result;
  }

  // is not prod access
  // access control verified
  if (!isProd(ctx)) {
    const verified = await accessControlTask(app, ctx, { contentId: pageId });
    if (!verified) {
      throw new AccessDeniedError(ctx.URL?.pathname);
    }
  }

  // get page
  const page = await pageTask(pageId, app, ctx);
  if (!page) {
    throw new NotFoundDSLError(pageId);
  }

  // parse page
  const { content: parsedContent, ctx: context } = await parseTask(page, ctx);
  if (!parsedContent.schemas) {
    throw new ParseDSLError(new Error('parsed.schemas is empty'), ctx.origin);
  }

  // render task
  const html = await renderTask(parsedContent as ParsedDSL, context);
  return { html, dsl: context.origin.page, vars: context.variables, contextValue: context };
};
