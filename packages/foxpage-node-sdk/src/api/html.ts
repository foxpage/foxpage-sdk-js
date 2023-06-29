import { getApplication, PageInstance } from '@foxpage/foxpage-manager';
import { tag } from '@foxpage/foxpage-shared';
import { Application, FoxpageRequestOptions, Page, ParsedDSL } from '@foxpage/foxpage-types';

import { isProd } from '../common';
import { updateContext } from '../context';
import { AccessDeniedError, NotFoundAppError, NotFoundDSLError, ParseDSLError } from '../errors';
import { accessControlTask, contextTask, pageTask, parseTask, renderTask } from '../task';

/**
 * render to html by pageId
 * @param pageId page id
 * @param appId application id
 * @returns html string
 */
export const renderToHtmlByPageId = async (pageId: string, appId: string, opt: FoxpageRequestOptions) => {
  const result = await renderByPageId(pageId, appId, opt);
  return result.html;
};

/**
 * render by pageId
 * @param pageId page id
 * @param appId application id
 * @returns html string
 */
export const renderByPageId = async (pageId: string, appId: string, opt: FoxpageRequestOptions) => {
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
  const { content, ctx: context } = await parseTask(page, ctx);
  if (!content.schemas) {
    throw new ParseDSLError(new Error('parsed.schemas is empty'), ctx.origin);
  }

  // render task
  const html = (await renderTask(content as ParsedDSL, context)) || null;
  return { html, dsl: context.origin.page, vars: context.variables, contextValue: context };
};

/**
 * render to html by page info
 * @param page page info
 * @param app app
 * @returns html
 */
export async function renderToHtmlByPage(
  page: Page,
  app: Application | string,
  opt: FoxpageRequestOptions & { ignoreParse?: boolean },
) {
  let appInstance: Application | undefined;
  if (typeof app === 'string') {
    appInstance = getApplication(app);
    if (!appInstance) {
      throw new NotFoundAppError(app);
    }
  } else {
    appInstance = app;
  }

  // init renderContext task
  const ctx = opt.ctx ? opt.ctx : await contextTask(appInstance, opt);

  // is not prod access
  // access control verified
  if (!isProd(ctx)) {
    const verified = await accessControlTask(appInstance, opt.request, { contentId: page.id });
    if (!verified) {
      throw new AccessDeniedError(opt.request.URL?.pathname);
    }
  }

  const pageInstance = new PageInstance(page);
  await updateContext(ctx, { app: appInstance, content: pageInstance });

  // parse page
  const { content, ctx: context } = await parseTask(pageInstance, ctx);
  if (!content.schemas) {
    throw new ParseDSLError(new Error('parsed.schemas is empty'), ctx.origin);
  }

  // render task
  const html = (await renderTask(content as ParsedDSL, context)) || null;
  return { html, dsl: context.origin.page, vars: context.variables, contextValue: context };
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

  // is not prod access
  // access control verified
  if (!isProd(ctx)) {
    const verified = await accessControlTask(app, opt.request, { fileId });
    if (!verified) {
      throw new AccessDeniedError(opt.request.URL?.pathname);
    }
  }

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
  const { content: parsedContent, ctx: context } = await parseTask(page, ctx);
  if (!parsedContent.schemas) {
    throw new ParseDSLError(new Error('parsed.schemas is empty'), ctx.origin);
  }

  // render task
  const html = (await renderTask(parsedContent as ParsedDSL, context)) || null;
  return { html, dsl: context.origin.page, vars: context.variables, contextValue: context };
};
