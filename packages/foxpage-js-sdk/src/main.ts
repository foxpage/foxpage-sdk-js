import Axios from 'axios';

import { createContentInstance, variable } from '@foxpage/foxpage-shared';
import { ContentDetail, Context, FPFile, Page, RelationInfo, RenderAppInfo } from '@foxpage/foxpage-types';

import { createRenderContext } from './context';
import { parse } from './parser';

export type PageParseOption = { appInfo: RenderAppInfo; relationInfo: RelationInfo; locale?: string; file: FPFile };
export type PageParseInServerOption = PageParseOption & {
  // not set, will redirect to the site host
  host?: string;
};

// simmer to foxpage-plugin-page-parse
export const PARSE_PAGE_PATH = '/_foxpage/parse-page';

/**
 * parse page
 * @param page page content
 * @param opt parse opt
 * @returns parsed content
 */
export const parsePage = async (page: Page, opt: PageParseOption) => {
  // init ctx
  const ctx: Context = createRenderContext(opt.appInfo);
  const contentInstances = createContentInstance({ ...opt.relationInfo, pages: [page] });
  ctx.updateOrigin({
    ...contentInstances,
    sysVariables: variable.getSysVariables(contentInstances as unknown as Record<string, ContentDetail[]>),
  });
  if (contentInstances.pages) {
    ctx.updateOriginPage(contentInstances.pages[0]);
  }
  ctx.file = opt.file;
  // parse
  const parsed = await parse(page, ctx);
  return parsed;
};

/**
 * parse page in server
 * @param page page content
 * @param opt parse option
 */
export const parsePageInServer = async (page: Page, opt: PageParseInServerOption) => {
  const url = opt.host ? `${opt.host}${PARSE_PAGE_PATH}` : PARSE_PAGE_PATH;
  const result = await Axios.post(url, {
    page,
    opt: {
      appId: opt.appInfo.appId,
      relationInfo: opt.relationInfo,
      locale: opt.locale,
      file: opt.file,
    },
  });
  return result;
};
