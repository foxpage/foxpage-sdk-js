import { merger, mocker, parser } from '@foxpage/foxpage-core';
import { getApplicationByPath, PageInstance } from '@foxpage/foxpage-manager';
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
import { getFoxpagePreviewTime, initEnv } from '../common';
import { createContext, updateContextWithPage } from '../context';
import { renderToHTML } from '../render/main';

import { getRelations, getRelationsBatch } from './../manager/main';
import { getPathname } from './route';

/**
 * get user request application task
 * @param pathname user request pathname
 * @returns Application | null |undefined
 */
export const appTask = (pathname: string) => {
  return getApplicationByPath(pathname);
};

/**
 * init render context
 * @param app application
 * @param opt contain ctx dependency data
 * @returns Context
 */
export const contextTask = async (app: Application, opt: FoxpageRequestOptions) => {
  const startTime = new Date().getTime();

  const ctx = await createContext(app, opt);
  // init env: debug,preview,...
  initEnv(ctx);

  const { afterContextCreate } = ctx.hooks || {};
  if (typeof afterContextCreate === 'function') {
    await afterContextCreate(ctx);
  }

  ctx.performance.start = startTime;
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
    const routeCost = ctx.performanceLogger('routerTime');
    const { searchParams } = ctx.URL;
    const pathnameStr = getPathname(app.slug, ctx);
    if (!pathnameStr) {
      return null;
    }
    // sys default routers
    const route = app.routeManager.getRoute(pathnameStr);
    if (route) {
      return route;
    }

    let searchStr = searchParams.toString();
    // set default locale & format pathname
    const { locale: defaultLocale } = app.configs || {};
    if (defaultLocale && !searchStr.includes('locale=')) {
      searchStr = searchStr ? `${searchStr}&locale=${defaultLocale}` : `locale=${defaultLocale}`;
    }
    if (!searchStr.includes('locale=') && !!ctx.locale) {
      searchStr = searchStr ? `${searchStr}&locale=${ctx.locale}` : `locale=${ctx.locale}`;
    }
    let _pathname = pathnameStr.toLowerCase();
    if (!pathnameStr.endsWith('.html') && !pathnameStr.endsWith('/')) {
      _pathname = `${_pathname}/`;
    }

    // get content by tags
    const tags = searchStr ? tag.generateTagByQuerystring(searchStr) : [];
    const file = await app.fileManager.getFileByPathname(_pathname);
    const result = await app.tagManager.matchTag(tags, {
      pathname: _pathname,
      fileId: file?.id || '',
      withContentInfo: !ctx.isPreviewMode,
    });

    routeCost();
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
 * file task
 * get file & set to context
 * @param fileId
 * @param app
 * @param ctx
 */
export const fileTask = async (fileId: string, app: Application, ctx: Context) => {
  const file = await app.fileManager.getFileById(fileId);
  ctx.file = file || undefined;
};

/**
 * get page task
 * @param pageId  pageId
 * @param app current application
 * @returns Promise<Application|null|undefined>
 */
export const pageTask = async (pageId: string, app: Application, ctx: Context) => {
  let _pageId = pageId;
  let page: Page | null = null;

  const getDSLCost = ctx.performanceLogger('getDSLTime');

  const { beforeDSLFetch, afterDSLFetch } = ctx.hooks || {};
  if (typeof beforeDSLFetch === 'function') {
    const result = await beforeDSLFetch(ctx);
    if (result.pageId) {
      _pageId = result.pageId;
    }
  }

  // get page dsl with mode
  if (ctx.isPreviewMode) {
    const contents = await app.pageManager.getDraftPages([_pageId]);
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
    // set preview time
    ctx._foxpage_preview_time = getFoxpagePreviewTime(ctx);
  } else {
    page = (await app.pageManager.getPage(_pageId)) || null;
  }

  // with merge
  page = await mergeTask(page, app, ctx);

  if (typeof afterDSLFetch === 'function') {
    page = await afterDSLFetch(ctx, page);
  }

  // create instance by page content
  // update context
  if (page) {
    page = new PageInstance(page);
    if (page) {
      if (ctx.isPreviewMode) {
        ctx.updateOriginPage(page);
      } else {
        await updateContextWithPage(ctx, { app, page });
      }
    }
  }

  // with mock
  if (ctx.isMock) {
    page = await mockTask(page, app, ctx);
  }

  if (page) {
    ctx.updatePage(page);
    // get file
    if (page.fileId) {
      await fileTask(page.fileId, app, ctx);
    }
  }

  getDSLCost();
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
      const relations = await app.getContentRelationInfo(base);
      if (relations) {
        // update base page relations
        Object.keys(relations).forEach(key => {
          const keyStr = key as keyof RelationInfo;
          if (relations[keyStr]) {
            // @ts-ignore
            ctx.updateOriginByKey(keyStr, (relations[keyStr] || []).concat(ctx.origin[keyStr] || []));
          }
        });
      }
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
      // // mock variables
      // const variables = mocker.mockVariable(relationInfo.variables, mocks, ctx);
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
  const parseCost = ctx.performanceLogger('parseTime');

  if (typeof beforeDSLParse === 'function') {
    await beforeDSLParse(ctx);
  }

  let parsed = await parser.parse(page, ctx);

  if (typeof afterDSLParse === 'function') {
    parsed = (await afterDSLParse(ctx)) || parsed;
  }

  parseCost();
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
    const renderCost = ctx.performanceLogger('renderTime');
    const opt: RenderToHTMLOptions = {
      useStructureVersion: ctx.isPreviewMode,
    };

    const html = await renderToHTML(parsed.schemas, ctx, opt);

    renderCost();
    return html;
  } catch (e) {
    const { onRenderError } = ctx.hooks || {};
    if (typeof onRenderError === 'function') {
      await onRenderError(ctx, e as Error);
    } else {
      throw e;
    }
  }
};
