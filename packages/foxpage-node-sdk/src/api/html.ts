import { getApplication, PageInstance } from '@foxpage/foxpage-manager';
import { tag } from '@foxpage/foxpage-shared';
import { Application, Page } from '@foxpage/foxpage-types';

import { FoxpageRequestOptions } from '../api';
import { updateContextWithPage } from '../context';
import { NotFoundAppError, NotFoundDSLError, ParseDSLError } from '../errors';
import { contextTask, pageTask, parseTask, renderTask } from '../task';

/**
 * render to html by pageId
 * @param pageId page id
 * @param appId application id
 * @returns html string
 */
export const renderToHtmlByPageId = async (pageId: string, appId: string, opt: FoxpageRequestOptions) => {
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
  const { page: parsedPage, ctx: context } = await parseTask(page, ctx);
  if (!parsedPage.schemas) {
    throw new ParseDSLError(new Error('parsedPage.schemas is empty'), ctx.origin);
  }

  // render task
  const html = (await renderTask(parsedPage, context)) || null;
  return html;
};

/**
 * render to html by page info
 * @param page page info
 * @param app app
 * @returns html
 */
export async function renderToHtmlByPage(
  page: Page,
  app: Application,
  opt: FoxpageRequestOptions,
): Promise<string | null> {
  const pageInstance = new PageInstance(page);

  // init renderContext task
  const ctx = opt.ctx ? opt.ctx : await contextTask(app, opt);
  await updateContextWithPage(ctx, { app, page: pageInstance });

  // parse page
  const { page: parsedPage, ctx: context } = await parseTask(pageInstance, ctx);
  if (!parsedPage.schemas) {
    throw new ParseDSLError(new Error('parsedPage.schemas is empty'), ctx.origin);
  }

  // render task
  const html = (await renderTask(parsedPage, context)) || null;
  return html;
}

/**
 * render html by file id and locale
 * @param fileId file id
 * @param locale locale
 * @param appId application id
 * @param opt options
 * @returns
 */
export const renderToHtmlByFileIdAndLocale = async (
  fileId: string,
  locale = '',
  appId: string,
  opt: FoxpageRequestOptions,
) => {
  const app = getApplication(appId);
  if (!app) {
    throw new NotFoundAppError(appId);
  }

  // init renderContext task
  const ctx = opt.ctx ? opt.ctx : await contextTask(app, opt);

  // get file
  const tags = locale ? tag.generateTagByQuerystring(`locale=${locale}`) : [];
  const content = await app.tagManager.matchTag(tags, {
    fileId,
    withContentInfo: !ctx.isPreviewMode,
  });
  if (!content) {
    throw new NotFoundDSLError(`fileId@${fileId}`);
  }

  // get page
  const page = await pageTask(content.id, app, ctx);
  if (!page) {
    throw new NotFoundDSLError(content.id);
  }

  // parse page
  const { page: parsedPage, ctx: context } = await parseTask(page, ctx);
  if (!parsedPage.schemas) {
    throw new ParseDSLError(new Error('parsedPage.schemas is empty'), ctx.origin);
  }

  // render task
  const html = (await renderTask(parsedPage, context)) || null;
  return { html, dsl: context.origin.page, vars: context.variables, contextValue: context };
};
