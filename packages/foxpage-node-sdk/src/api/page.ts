import { getApplication } from '@foxpage/foxpage-manager';
import { Context, FoxpageRequestOptions, FPFile, Page, RelationInfo } from '@foxpage/foxpage-types';

import { NotFoundAppError, NotFoundDSLError, ParseDSLError } from '../errors';
import { contextTask, initRelationsTask, parseTask } from '../task';

export interface ParsePageOptions {
  appId: string;
  relationInfo?: RelationInfo;
  req: FoxpageRequestOptions;
  ctx?: Context;
  locale?: string;
  file: FPFile;
}

/**
 * parse page
 * default relations use the api opts
 * support fetch relations from local too
 * @param page page content
 * @param opt parse page options
 * @returns parsed
 */
export const parsePage = async (page: Page, opt: ParsePageOptions) => {
  const app = getApplication(opt.appId);
  if (!app) {
    throw new NotFoundAppError(opt.appId);
  }

  // init context & contents instance
  const ctx = opt.ctx ? opt.ctx : await contextTask(app, opt.req);
  const instances = initRelationsTask({ ...opt.relationInfo, pages: [page] }, ctx);
  if (!instances.pages || !instances.pages[0]) {
    throw new NotFoundDSLError(page.id);
  }

  const { content, ctx: context } = await parseTask(instances.pages[0], ctx);
  if (!content.schemas) {
    throw new ParseDSLError(new Error('parsed.schemas is empty'), ctx.origin);
  }

  return { parsedPage: content.schemas, variables: context.variables };
};
