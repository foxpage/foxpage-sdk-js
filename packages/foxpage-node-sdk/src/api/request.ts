import { appTask, contextTask, pageTask, parseTask, renderTask, tagTask } from '../task';

import { FoxpageRequestOptions } from './interface';

/**
 * request handler
 * @returns html
 */
export const routerHandler = () => async (opt: FoxpageRequestOptions) => {
  try {
    if (!opt.request?.URL) {
      return;
    }
    const { URL } = opt.request;

    // get app
    const app = appTask(URL.pathname);
    if (!app) {
      return;
    }

    // init renderContext task
    const ctx = await contextTask(app, opt);

    // get content
    const content = await tagTask(app, ctx);
    if (!content) {
      return null;
    }

    // get page
    const page = await pageTask(content.id, app, ctx);
    if (!page) {
      return null;
    }

    // parse page
    const { page: parsedPage, ctx: context } = await parseTask(page, ctx);
    if (!parsedPage.schemas) {
      return null;
    }

    // render task
    const html = await renderTask(parsedPage, context);
    return html;
  } catch (e) {
    throw new Error((e as Error).message);
  }
};
