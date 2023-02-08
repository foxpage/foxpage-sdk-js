import { getApplication } from '@foxpage/foxpage-manager';
import { Context, FPFile, Page, RelationInfo } from '@foxpage/foxpage-types';

import { NotFoundAppError, NotFoundDSLError, ParseDSLError } from '../errors';
import { contextTask, initRelationsTask, parseTask } from '../task';

import { FoxpageRequestOptions } from './interface';

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
  const instances = initRelationsTask({ ...opt.relationInfo, page: [page] }, ctx);
  if (!instances.page || !instances.page[0]) {
    throw new NotFoundDSLError(page.id);
  }

  const { page: parsedPage, ctx: context } = await parseTask(instances.page[0], ctx);
  if (!parsedPage.schemas) {
    throw new ParseDSLError(new Error('parsedPage.schemas is empty'), ctx.origin);
  }

  return { parsedPage: parsedPage.schemas, variables: context.variables };
};
