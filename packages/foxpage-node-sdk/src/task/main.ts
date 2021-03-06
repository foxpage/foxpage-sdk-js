import { merger, mocker, parser } from '@foxpage/foxpage-core';
import { getApplicationBySlug, PageInstance } from '@foxpage/foxpage-manager';
import { createContentInstance, relationsMerge, tag, variable } from '@foxpage/foxpage-shared';
import {
  Application,
  ContentDetail,
  Context,
  Page,
  ParsedDSL,
  RelationInfo,
  RenderToHTMLOptions,
} from '@foxpage/foxpage-types';

import { FoxpageRequestOptions } from '../api';
import { initEnv } from '../common';
import { createContext, updateContextWithPage } from '../context';
import { renderToHTML } from '../render/main';

import { getRelations, getRelationsBatch } from './../manager/main';

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

  // init env: debug,preview,...
  initEnv(ctx);

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
export const routerTask = async (app: Application, ctx: Context) => {
  if (!ctx.URL) {
    return null;
  }

  try {
    const { pathname, searchParams } = ctx.URL;
    const pathnameStr = app.slug ? pathname.replace(`/${app.slug}`, '') : pathname;

    const route = app.routeManager.getRoute(pathnameStr);
    if (route) {
      return route;
    }

    const searchStr = searchParams.toString();
    const tags = searchStr ? tag.generateTagByQuerystring(searchStr) : [];

    const file = await app.fileManager.getFileByPathname(pathnameStr);
    const result = await app.tagManager.matchTag(tags, {
      pathname: pathnameStr,
      fileId: file?.id || '',
      withContentInfo: !ctx.isPreviewMode,
    });
    return result;
  } catch (e) {
    ctx.logger?.warn(`get route failed: ${(e as Error).message}`);
    return null;
  }
};

/**
 * init relation task for create content instance by relation
 * @param contents content
 * @param ctx context
 */
export const initRelationsTask = (contents: RelationInfo & { page: Page[] }, ctx: Context) => {
  const contentInstances = createContentInstance({ ...contents });
  // update ctx
  ctx.updateOrigin({
    ...contentInstances,
    sysVariables: variable.getSysVariables(contentInstances as unknown as Record<string, ContentDetail[]>),
  });
  ctx.updateOriginPage(contentInstances.page[0]);
  return contentInstances;
};

/**
 * get page task
 * @param pageId  pageId
 * @param app current application
 * @returns Promise<Application|null|undefined>
 */
export const pageTask = async (pageId: string, app: Application, ctx: Context) => {
  let page: Page | null = null;

  const { beforeDSLFetch, afterDSLFetch } = ctx.hooks || {};
  if (typeof beforeDSLFetch === 'function') {
    await beforeDSLFetch(ctx);
  }

  // get page dsl with mode
  if (ctx.isPreviewMode) {
    const contents = await app.pageManager.getDraftPages([pageId]);
    if (contents) {
      const { content, relations, mock } = contents[0];
      page = content as Page;
      if (page) {
        initRelationsTask({ ...relations, page: [page] }, ctx);
        if (mock) {
          ctx.updateOriginByKey('mocks', [mock]);
        }
      }
    }
  } else {
    page = (await app.pageManager.getPage(pageId)) || null;
  }

  if (typeof afterDSLFetch === 'function') {
    page = await afterDSLFetch(ctx, page);
  }

  // with merge
  page = await mergeTask(page, app, ctx);

  // create instance by page content
  // update context
  if (page) {
    page = new PageInstance(page);
    if (ctx.isPreviewMode) {
      ctx.updateOriginPage(page);
    } else {
      await updateContextWithPage(ctx, { app, page });
    }
  }

  // with mock
  if (ctx.isMock) {
    page = await mockTask(page, app, ctx);
  }

  return page;
};

export const fetchDSLTask = pageTask;

/**
 * page merge task
 * @param page base page
 * @param app application
 * @param ctx Context
 * @returns merged page
 */
export const mergeTask = async (page: Page | null, app: Application, ctx: Context) => {
  if (!page) {
    return null;
  }

  const { extendId } = page.extension || {};
  if (extendId) {
    const base = await app.pageManager.getPage(extendId);
    if (base) {
      ctx.updateOriginByKey('extendPage', base);
      const merged = merger.merge(base, page, { strategy: merger.MergeStrategy.COMBINE_BY_EXTEND });
      return merged;
    }
    ctx.logger?.error(`The base page is invalid @${extendId}`);
    return null;
  }

  return page;
};

/**
 * pre mock task
 * @param page page content
 * @param ctx context
 */
const preMockTask = (page: Page, ctx: Context) => {
  const { mockId, extendId } = page.extension || {};
  const mockIds: string[] = [];

  // get page mock
  if (mockId) {
    const exist = ctx.getOrigin('mocks')?.findIndex(item => item.id === mockId);
    if ((!exist && exist !== 0) || exist === -1) {
      mockIds.push(mockId);
    }
  }

  // get extend page mock
  if (extendId) {
    const extendPage = ctx.getOrigin('extendPage');
    if (extendId === extendPage?.id && !!extendPage.extension?.mockId) {
      mockIds.push(extendPage.extension?.mockId);
    }
  }

  // get templates mocks
  const templates = ctx.getOrigin('templates');
  if (templates && templates.length > 0) {
    templates.forEach(item => {
      const mockId = item.extension?.mockId;
      if (mockId) {
        mockIds.push(mockId);
      }
    });
  }

  return mockIds;
};

/**
 * mock task
 * @param page page content
 * @param app application
 * @param ctx context
 * @returns new page with mock
 */
export const mockTask = async (page: Page | null, app: Application, ctx: Context) => {
  if (!page) {
    return null;
  }

  let mocks = ctx.getOrigin('mocks') || [];

  const mockIds = preMockTask(page, ctx);
  if (mockIds.length > 0) {
    const list = await app.mockManager.getMocks(mockIds);
    mocks = mocks.concat(list);
  }
  const { page: mockedPage, templates } = mocker.withMock(mocks, ctx);

  if (mockedPage) {
    // get new relations via page
    const pageRelationInfo = await getRelations(mockedPage, app);
    // get new relations via template
    const templateRelationInfos = await getRelationsBatch(templates, app);
    pageRelationInfo.templates = templates;
    // final relations
    const relationInfo = relationsMerge(templateRelationInfos, pageRelationInfo);
    if (relationInfo) {
      ctx.updateOrigin({ ...relationInfo, mocks });
    }

    return new PageInstance(mockedPage);
  }

  return page;
};

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
