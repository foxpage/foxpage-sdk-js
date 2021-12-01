import { Context } from 'koa';

import { createLogger, renderToHtmlByPageId } from '@foxpage/foxpage-node-sdk';

export enum RenderStatus {
  SUCCEED = 200,
  PAGE_RENDER_ERROR = 1000,
  PAGE_RENDER_EMPTY = 1004,
}

export interface RenderRes {
  code: RenderStatus;
  msg: string;
  html?: string;
}

const logger = createLogger('App server');

class PageService {
  /**
   * render page
   *
   * @param {string} appId application id
   * @param {string} pageId page content id
   * @returns {Promise<RenderRes>}
   */
  render = async (appId: string, pageId: string, ctx: Context): Promise<RenderRes> => {
    const result: RenderRes = {
      code: RenderStatus.SUCCEED,
      msg: 'render succeed.',
    };
    let html: string | undefined;
    try {
      html =
        (await renderToHtmlByPageId(pageId, appId, {
          request: ctx.request,
          response: ctx.response,
          cookies: ctx.cookies,
        })) || '';
      if (!html) {
        result.code = RenderStatus.PAGE_RENDER_EMPTY;
        result.msg = `page@${pageId} render to string is null.`;
      }
    } catch (e) {
      result.code = RenderStatus.PAGE_RENDER_ERROR;
      result.msg = `page render failed: ${(e as Error).message}`;
      logger.error('page render failed', e);
    }

    return {
      ...result,
      html,
    };
  };
}

export default new PageService();
