import { Application, Context, ContextPage, FoxpageRequestOptions } from '@foxpage/foxpage-types';

import { RenderContextInstance } from './render';

/**
 * create render context
 * @param app application
 * @param opt request options
 * @returns render context
 */
export const createContext = async (app: Application, opt: FoxpageRequestOptions) => {
  const ctx = new RenderContextInstance(app) as unknown as Context;
  const { isDebug, isMock, isPreview, isCanary } = opt.mode || {};

  // request
  ctx.request = opt.request;
  ctx.response = opt.response;
  ctx.cookies = opt.cookies;

  // mode
  ctx.isMock = isMock;
  ctx.isPreviewMode = isPreview;
  ctx.isDebugMode = isDebug;
  ctx.isCanary = isCanary;

  // url
  ctx.URL = opt.request.URL;
  ctx.url = ctx.URL.href || '';
  ctx.host = ctx.URL.host || '';

  return ctx;
};

/**
 * update ctx with content info
 * @param ctx context
 * @param content content info
 */
export const updateContext = async (ctx: Context, opt: { content: ContextPage; app: Application }) => {
  const { app, content } = opt;
  ctx.updateOriginPage(content);
  const relations = await app.getContentRelationInfo(content);
  if (relations) {
    ctx.updateOrigin(relations);
  }
};
