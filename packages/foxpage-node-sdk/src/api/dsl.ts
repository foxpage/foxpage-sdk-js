import { getApplication } from '@foxpage/foxpage-manager';
import { FoxpageRequestOptions } from '@foxpage/foxpage-types';

import { isProd } from '../common';
import { AccessDeniedError, NotFoundAppError, NotFoundDSLError } from '../errors';
import { accessControlTask, contextTask, pageTask, parseTask } from '../task';

export const getDSL = async (pageId: string, appId: string, opt: FoxpageRequestOptions) => {
  const app = getApplication(appId);
  if (!app) {
    throw new NotFoundAppError(appId);
  }

  // init renderContext task
  const ctx = opt.ctx ? opt.ctx : await contextTask(app, opt);

  // is not prod access
  // access control verified
  if (!isProd(ctx)) {
    const verified = await accessControlTask(app, opt.request, { contentId: pageId });
    if (!verified) {
      throw new AccessDeniedError(opt.request.URL?.pathname);
    }
  }

  // get page
  const page = await pageTask(pageId, app, ctx);
  if (!page) {
    throw new NotFoundDSLError(pageId);
  }

  // parse page
  const { content } = await parseTask(page, ctx);

  return content?.schemas;
};
