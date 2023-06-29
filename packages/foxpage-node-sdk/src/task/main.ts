import { merger, mocker, parser } from '@foxpage/foxpage-core';
import { BlockInstance, getApplicationByPath, PageInstance } from '@foxpage/foxpage-manager';
import { contentInitData, createContentInstance, relationsMerge, tag, variable } from '@foxpage/foxpage-shared';
import {
  Application,
  Block,
  ContentDetail,
  Context,
  ContextPage,
  FoxpageDelegatedRequest,
  FoxpageRequestOptions,
  Page,
  ParsedDSL,
  RelationInfo,
  RenderToHTMLOptions,
  StructureNode,
  TicketCheckData,
} from '@foxpage/foxpage-types';

import { getFoxpagePreviewTime, getPageId, getTicket, initEnv } from '../common';
import { createContext, updateContext } from '../context';
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
 * access control task
 * @param app application
 * @param request request
 */
export const accessControlTask = async (
  app: Application,
  ctx: FoxpageDelegatedRequest | Context,
  opt: TicketCheckData = {},
) => {
  const { accessControl } = app.configs.security || {};
  const { enable = true } = accessControl || {};
  if (!enable) {
    return true;
  }

  let result = false;
  const ticket = getTicket(ctx as Context);
  if (ticket) {
    const _contentId = opt.contentId || getPageId(ctx as Context) || '';
    const _fileId = opt.fileId || '';
    result = await app.securityManager.ticketCheck(ticket, { contentId: _contentId, fileId: _fileId });
  }

  return result;
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
export const initRelationsTask = (contents: contentInitData, ctx: Context) => {
  const contentInstances = createContentInstance({ ...contents });
  // update ctx
  ctx.updateOrigin({
    ...contentInstances,
    sysVariables: variable.getSysVariables(contentInstances as unknown as Record<string, ContentDetail[]>),
  });
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
        const contentInstances = initRelationsTask({ ...relations, pages: [page] }, ctx);
        const pageInstance = contentInstances.pages ? contentInstances.pages[0] : null;
        if (pageInstance) {
          ctx.updateOriginPage(pageInstance);
        }
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
        await updateContext(ctx, { app, content: page });
      }
    }
  }

  // with mock
  if (ctx.isMock) {
    const mockedContent = await mockTask(page, app, ctx);
    if (mockedContent) {
      page = new PageInstance(mockedContent as Page);
    }
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

export const blockTask = async (blockId: string, app: Application, ctx: Context) => {
  let _blockId = blockId;
  let block: Block | null = null;

  const getDSLCost = ctx.performanceLogger('getDSLTime');

  const { beforeDSLFetch, afterDSLFetch } = ctx.hooks || {};
  if (typeof beforeDSLFetch === 'function') {
    const result = await beforeDSLFetch(ctx);
    if (result.contentId) {
      _blockId = result.contentId;
    }
  }

  // get block dsl with mode
  if (ctx.isPreviewMode) {
    const contents = await app.blockManager.getDraftBlocks([_blockId]);
    if (contents) {
      const { content, relations, mock } = contents[0];
      block = content as Block;
      if (block) {
        const contentInstances = initRelationsTask({ ...relations, blocks: [block] }, ctx);
        const blockInstance = contentInstances.blocks ? contentInstances.blocks[0] : null;
        if (blockInstance) {
          ctx.updateOriginPage(blockInstance);
        }
        if (mock) {
          ctx.updateOriginByKey('mocks', [mock]);
        }
      }
    }
    // set preview time
    ctx._foxpage_preview_time = getFoxpagePreviewTime(ctx);
  } else {
    block = (await app.blockManager.getBlock(_blockId)) || null;
  }

  // // with merge
  // block = await mergeTask(block, app, ctx);

  if (typeof afterDSLFetch === 'function') {
    block = await afterDSLFetch(ctx, block);
  }

  // create instance by block content
  // update context
  if (block) {
    block = new BlockInstance(block);
    if (block) {
      if (ctx.isPreviewMode) {
        ctx.updateOriginPage(block);
      } else {
        await updateContext(ctx, { app, content: block });
      }
    }
  }

  // with mock
  if (ctx.isMock) {
    const mockedBlock = await mockTask(block, app, ctx);
    if (mockedBlock) {
      block = new BlockInstance(mockedBlock as Block);
    }
  }

  if (block) {
    ctx.updatePage(block);
    // get file
    if (block.fileId) {
      await fileTask(block.fileId, app, ctx);
    }
  }

  getDSLCost();
  return block;
};

export const fetchBlockTask = blockTask;

/**
 * content merge task
 * only support page content
 * @param content base content
 * @param app application
 * @param ctx Context
 * @returns merged content
 */
export const mergeTask = async (content: ContentDetail<StructureNode> | null, app: Application, ctx: Context) => {
  if (!content) {
    return null;
  }

  const { extendId } = content.extension || {};
  if (extendId) {
    const base = await app.pageManager.getPage(extendId);
    if (base) {
      ctx.updateOriginByKey('extendPage', base);
      const relations = await app.getContentRelationInfo(base);
      if (relations) {
        // update base content relations
        Object.keys(relations).forEach(key => {
          const keyStr = key as keyof RelationInfo;
          if (relations[keyStr]) {
            // @ts-ignore
            ctx.updateOriginByKey(keyStr, (relations[keyStr] || []).concat(ctx.origin[keyStr] || []));
          }
        });
      }
      const merged = merger.merge(base, content, {
        strategy: merger.MergeStrategy.COMBINE_BY_EXTEND,
      });
      return merged;
    }
    ctx.logger?.error(`The base content is invalid @${extendId}`);
    return null;
  }

  return content;
};

/**
 * pre mock task
 * @param content content
 * @param ctx context
 */
const preMockTask = (content: ContentDetail, ctx: Context) => {
  const { mockId, extendId } = content.extension || {};
  const mockIds: string[] = [];

  // get content mock
  if (mockId) {
    const exist = ctx.getOrigin('mocks')?.findIndex(item => item.id === mockId);
    if ((!exist && exist !== 0) || exist === -1) {
      mockIds.push(mockId);
    }
  }

  // get extend content mock
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
 * @param content content
 * @param app application
 * @param ctx context
 * @returns new content with mock
 */
export const mockTask = async (content: ContentDetail | null, app: Application, ctx: Context) => {
  if (content) {
    let mocks = ctx.getOrigin('mocks') || [];
    const mockIds = preMockTask(content, ctx);
    if (mockIds.length > 0) {
      const list = await app.mockManager.getMocks(mockIds);
      mocks = mocks.concat(list);
    }

    const { content: mockedContent, templates } = mocker.withMock(mocks, ctx);
    if (mockedContent) {
      // get new relations via content
      const pageRelationInfo = await getRelations(mockedContent, app);
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

      return mockedContent;
    }
  }
};

/**
 * parse content task
 * @param content content
 * @param ctx Context
 * @returns ParsedDSL
 */
export const parseTask = async <T extends ContextPage>(content: T, ctx: Context) => {
  const { beforeDSLParse, afterDSLParse } = ctx.hooks || {};
  const parseCost = ctx.performanceLogger('parseTime');

  if (typeof beforeDSLParse === 'function') {
    await beforeDSLParse(ctx);
  }

  let parsed = await parser.parse(content, ctx);

  if (typeof afterDSLParse === 'function') {
    parsed = (await afterDSLParse(ctx)) || parsed;
  }

  parseCost();
  return parsed;
};

/**
 * render task
 * @param parsed parsed content schemas
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
