import { getApplication } from '@foxpage/foxpage-manager';

import { FoxpageRequestOptions } from '../api';
import { NotFoundAppError, NotFoundDSLError } from '../errors';
import { contextTask, pageTask, parseTask } from '../task';

export const getDSL = async (pageId: string, appId: string, opt: FoxpageRequestOptions) => {
  const app = getApplication(appId);
  if (!app) {
    throw new NotFoundAppError(appId);
  }

  // init renderContext task
  const ctx = opt.ctx ? opt.ctx : await contextTask(app, opt);

  // get page
  const page = await pageTask(pageId, app, ctx);
  if (!page) {
    throw new NotFoundDSLError(pageId);
  }

  // parse page
  const { page: parsedPage } = await parseTask(page, ctx);

  return parsedPage?.schemas;
};
