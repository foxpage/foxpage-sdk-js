import { createContentInstance, variable } from '@foxpage/foxpage-shared';
import { ContentDetail, Context, Page, RelationInfo, RenderAppInfo } from '@foxpage/foxpage-types';

import { createRenderContext } from './context';
import { parse } from './parser';

export type PageParseOption = { appInfo: RenderAppInfo; relationInfo: RelationInfo };

/**
 * parse page
 * @param page page content
 * @param opt parse opt
 * @returns parsed content
 */
export const parsePage = async (page: Page, opt: PageParseOption) => {
  // init ctx
  const ctx: Context = createRenderContext(opt.appInfo);
  const contentInstances = createContentInstance({ ...opt.relationInfo, page: [page] });
  ctx.updateOrigin({
    ...contentInstances,
    sysVariables: variable.getSysVariables(contentInstances as unknown as Record<string, ContentDetail[]>),
  });
  ctx.updateOriginPage(contentInstances.page[0]);
  // parse
  const parsed = await parse(page, ctx);
  return parsed;
};
