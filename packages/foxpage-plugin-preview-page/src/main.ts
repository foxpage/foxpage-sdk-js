import { RenderPageError, renderToHtmlByPageId } from '@foxpage/foxpage-node-sdk';
import { Context, Route } from '@foxpage/foxpage-types';

const COMMON_SUFFIX = '/_foxpage';

/**
 * register router
 * @returns route
 */
export const handleRegisterRouter = async () => {
  return {
    pathname: `${COMMON_SUFFIX}/preview`,
    action: async (ctx: Context) => {
      try {
        const { appid, pageid } = ctx.request.query as unknown as {
          appid: string;
          pageid: string;
        };
        if (!appid) {
          throw new Error('App id is empty!');
        }
        if (!pageid) {
          throw new Error('page id is empty!');
        }
        const url = ctx.URL?.href + `&preview`;
        ctx.url = url;
        ctx.isPreviewMode = true;
        ctx.isMock = ctx.URL?.searchParams?.has('mock') ?? false;
        return await renderToHtmlByPageId(pageid, appid, {
          request: ctx.request,
          response: ctx.response,
          cookies: ctx.cookies,
          ctx,
        });
      } catch (e) {
        throw new RenderPageError(new Error(`render page failed: ${(e as Error).message}`), ctx.page);
      }
    },
  } as Route;
};
