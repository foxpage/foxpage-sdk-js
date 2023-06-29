import { getApplication } from '@foxpage/foxpage-manager';
import { FoxpageRequestOptions, ParsedDSL } from '@foxpage/foxpage-types';

import { isProd } from '../common';
import { AccessDeniedError, NotFoundAppError, NotFoundDSLError, ParseDSLError } from '../errors';
import { accessControlTask, blockTask, contextTask, parseTask, renderTask } from '../task';

/**
 * get block dsl
 * @param contentId
 * @param appId
 * @param opt
 * @returns
 */
export const getBlockDSL = async (contentId: string, appId: string, opt: FoxpageRequestOptions) => {
  const app = getApplication(appId);
  if (!app) {
    throw new NotFoundAppError(appId);
  }

  // init renderContext task
  const ctx = opt.ctx ? opt.ctx : await contextTask(app, opt);

  // is not prod access
  // access control verified
  if (!isProd(ctx)) {
    const verified = await accessControlTask(app, opt.request, { contentId });
    if (!verified) {
      throw new AccessDeniedError(opt.request.URL?.pathname);
    }
  }

  // get block
  const block = await blockTask(contentId, app, ctx);
  if (!block) {
    throw new NotFoundDSLError(contentId);
  }

  // parse block
  const { content } = await parseTask(block, ctx);

  return content?.schemas;
};

/**
 * render block html by id
 * @param contentId block id
 * @param appId application id
 * @returns html string
 */
export const renderBlockHtml = async (contentId: string, appId: string, opt: FoxpageRequestOptions) => {
  const app = getApplication(appId);
  if (!app) {
    throw new NotFoundAppError(appId);
  }

  // init renderContext task
  const ctx = opt.ctx ? opt.ctx : await contextTask(app, opt);

  // is not prod access
  // access control verified
  if (!isProd(ctx)) {
    const verified = await accessControlTask(app, opt.request, { contentId });
    if (!verified) {
      throw new AccessDeniedError(opt.request.URL?.pathname);
    }
  }

  // get block
  const block = await blockTask(contentId, app, ctx);
  if (!block) {
    throw new NotFoundDSLError(contentId);
  }

  // parse block
  const { content, ctx: context } = await parseTask(block, ctx);
  if (!content.schemas) {
    throw new ParseDSLError(new Error('parsed.schemas is empty'), ctx.origin);
  }

  // render task
  const html = (await renderTask(content as ParsedDSL, context)) || null;
  return { html, dsl: context.origin.page, vars: context.variables, contextValue: context };
};
