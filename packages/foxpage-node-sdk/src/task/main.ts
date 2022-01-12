import { parser } from '@foxpage/foxpage-core';
import { getApplicationBySlug, PageInstance } from '@foxpage/foxpage-manager';
import { createContentInstance, tag, variable } from '@foxpage/foxpage-shared';
import { Application, ContentDetail, Context, Page, ParsedDSL, RenderToHTMLOptions } from '@foxpage/foxpage-types';

import { FoxpageRequestOptions } from '../api';
import { isPreviewMode } from '../common';
import { createContext, updateContextWithPage } from '../context';
import { renderToHTML } from '../render/main';

/**
 * get user request application task
 * @param pathname user request pathname
 * @returns Application | null |undefined
 */
export const appTask = (pathname: string) => {
  const appSlug = pathname.split('/')[1];
  if (!appSlug) {
    return null;
  }
  return getApplicationBySlug(appSlug);
};

/**
 * init render context
 * @param app application
 * @param opt contain ctx dependency data
 * @returns Context
 */
export const contextTask = async (app: Application, opt: FoxpageRequestOptions) => {
  const ctx = await createContext(app, opt);

  ctx.isPreviewMode = isPreviewMode(ctx);

  const { afterContextCreate } = ctx.hooks || {};
  if (typeof afterContextCreate === 'function') {
    await afterContextCreate(ctx);
  }

  return ctx;
};

/**
 * router task: get the matched content
 * @param url user request url
 * @param app current application
 * @returns Promise<FPRouter | undefined>
 */
export const tagTask = async (app: Application, ctx: Context) => {
  if (!ctx.URL) {
    return null;
  }

  const { pathname, searchParams } = ctx.URL;
  const _pathname = (app.slug ? pathname.replace(`/${app.slug}`, '') : pathname).substr(1);

  const tags = tag.generateTagByQuerystring(searchParams.toString());

  const file = await app.fileManager.getFileByPathname(_pathname);
  return await app.tagManager.matchTag(tags, {
    pathname: _pathname,
    fileId: file?.id || '',
    withContentInfo: !ctx.isPreviewMode,
  });
};

/**
 * get page task
 * @param pageId  pageId
 * @param app current application
 * @returns Promise<Application|null|undefined>
 */
export const pageTask = async (pageId: string, app: Application, ctx: Context) => {
  let page: Page | undefined;

  const { beforeDSLFetch, afterDSLFetch } = ctx.hooks || {};
  if (typeof beforeDSLFetch === 'function') {
    await beforeDSLFetch(ctx);
  }

  // mode check
  if (ctx.isPreviewMode) {
    const contents = await app.pageManager.getDraftPages([pageId]);
    if (contents) {
      const { content, relations } = contents[0];
      page = content as Page;
      if (page) {
        const contentInstances = createContentInstance({ ...relations, page: [page] });
        // update ctx
        ctx.updateOrigin({
          ...contentInstances,
          sysVariables: variable.getSysVariables(contentInstances as unknown as Record<string, ContentDetail[]>),
        });
        ctx.updateOriginPage(contentInstances.page[0]);
      }
    }
  } else {
    page = await app.pageManager.getPage(pageId);
    if (page) {
      // update ctx
      await updateContextWithPage(ctx, { app, page });
    }
  }

  if (typeof afterDSLFetch === 'function') {
    const prePage = await afterDSLFetch(ctx, page);
    if (prePage) {
      page = new PageInstance(prePage);
      await updateContextWithPage(ctx, { app, page });
    }
  }

  return page;
};

export const fetchDSLTask = pageTask;

/**
 * parse page task
 * @param page page content
 * @param ctx Context
 * @returns ParsedDSL
 */
export const parseTask = async (page: Page, ctx: Context) => {
  const { beforeDSLParse, afterDSLParse } = ctx.hooks || {};

  if (typeof beforeDSLParse === 'function') {
    await beforeDSLParse(ctx);
  }

  let parsed = await parser.parse(page, ctx);

  if (typeof afterDSLParse === 'function') {
    parsed = (await afterDSLParse(ctx)) || parsed;
  }

  return parsed;
};

/**
 * render task
 * @param parsed parsed page schemas
 * @param ctx render context
 * @returns html string
 */
export const renderTask = async (parsed: ParsedDSL, ctx: Context) => {
  try {
    const opt: RenderToHTMLOptions = {
      useStructureVersion: ctx.isPreviewMode,
    };
    return await renderToHTML(parsed.schemas, ctx, opt);
  } catch (e) {
    const { onRenderError } = ctx.hooks || {};
    if (typeof onRenderError === 'function') {
      await onRenderError(ctx, e as Error);
    }
  }
};
