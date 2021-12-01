import { getApplication } from '@foxpage/foxpage-manager';

import { FoxpageRequestOptions } from '../api';
import { contextTask, pageTask, parseTask } from '../task';

export const getDSL = async (pageId: string, appId: string, opt: FoxpageRequestOptions) => {
  const app = getApplication(appId);
  if (!app) {
    return null;
  }

  // init renderContext task
  const ctx = await contextTask(app, opt);

  // get page
  const page = await pageTask(pageId, app, ctx);
  if (!page) {
    return null;
  }

  // parse page
  const { page: parsedPage } = await parseTask(page, ctx);

  return parsedPage?.schemas;
};
