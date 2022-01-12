import { Application, Context, Page } from '@foxpage/foxpage-types';

import { FoxpageRequestOptions } from '../api';

import { RenderContextInstance } from './render';

/**
 * create render context
 * @param app application
 * @param opt request options
 * @returns render context
 */
export const createContext = async (app: Application, opt: FoxpageRequestOptions) => {
  const ctx = new RenderContextInstance(app) as unknown as Context;

  ctx.request = opt.request;
  ctx.response = opt.response;
  ctx.cookies = opt.cookies;
  ctx.URL = opt.request.URL;
  ctx.url = ctx.URL.href || '';
  ctx.host = ctx.URL.host || '';

  return ctx;
};

/**
 * update ctx with page info
 * @param ctx context
 * @param page page content info
 */
export const updateContextWithPage = async (ctx: Context, opt: { page: Page; app: Application }) => {
  const { app, page } = opt;
  ctx.updateOriginPage(page);
  const relations = await app.getContentRelationInfo(page);
  if (relations) {
    ctx.updateOrigin(relations);
  }
};
