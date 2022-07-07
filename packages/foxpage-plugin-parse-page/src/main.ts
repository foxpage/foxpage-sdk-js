import { parsePage, ParsePageOptions } from '@foxpage/foxpage-node-sdk';
import { Context, Page, Route } from '@foxpage/foxpage-types';

const COMMON_SUFFIX = '/_foxpage';

/**
 * register router
 * @returns route
 */
export const handleParsePage = async () => {
  return {
    pathname: `${COMMON_SUFFIX}/parse-page`,
    action: async (ctx: Context) => {
      const params = ctx.request.body as {
        page: Page;
        locale?: string;
        opt: ParsePageOptions;
      };
      try {
        ctx.logger?.info('parse-page params:', JSON.stringify(params));
        ctx.locale = params.opt?.locale;
        const result = await parsePage(params.page, {
          ...params.opt,
          ctx,
        });
        return {
          status: true,
          result,
        };
      } catch (e) {
        ctx.logger?.error('parse page failed', e);
        return {
          status: false,
          result: `parse page failed: ${(e as Error).message}`,
        };
      }
    },
  } as unknown as Route;
};
