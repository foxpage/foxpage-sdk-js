import { structure as structureUtils } from '@foxpage/foxpage-core';
import { Context } from '@foxpage/foxpage-types';

import { DebugEntry, DebugPlaceholder, PLACEHOLDER } from './components';
import { DebugState } from './interface';

const COMMON_SUFFIX = '/_foxpage';

/**
 * before page render handler
 * note: the debugger must deps the head & body node
 * @param ctx context
 * @returns
 */
export const handleBeforePageRender = async (ctx: Context) => {
  const { enable = true, url: customURL } = ctx.appConfigs?.debugger || {};
  // not open debugger
  if (!enable) {
    return ctx.page?.schemas;
  }

  const debug = ctx.isDebugMode || false;
  const dsl = ctx.page?.schemas;
  if (debug) {
    const head = structureUtils.findHead(dsl, ctx);
    const body = structureUtils.findBody(dsl, ctx);
    if (head && body) {
      const headResult = structureUtils.createStructureWithFactory(DebugPlaceholder, {});
      structureUtils.appendStructure(head, headResult.structure, headResult.component, ctx);

      let realURL: string | undefined = '';

      if (typeof customURL === 'function') {
        realURL = customURL(ctx.request.req);
      } else {
        realURL = customURL;
      }

      if (!realURL) {
        realURL = `${ctx.URL?.origin}${
          ctx.appConfigs?.virtualPath ? `/${ctx.appConfigs?.virtualPath}` : ''
        }${COMMON_SUFFIX}/static/debugger.min.js`;
      }

      const bodyResult = structureUtils.createStructureWithFactory(DebugEntry, {
        url: realURL,
      });
      structureUtils.appendStructure(body, bodyResult.structure, bodyResult.component, ctx);
    } else {
      ctx.logger?.warn('init debugger failed:', !head ? 'head node is empty!' : 'body node is empty!');
    }
  }

  return dsl;
};

/**
 * after page render handler
 * @param ctx context
 * @param html rendered html
 * @returns
 */
export const handleAfterPageRender = (ctx: Context, html: string) => {
  const { enable = true } = ctx.appConfigs?.debugger || {};
  // not open debugger
  if (!enable) {
    return html;
  }

  const debug = ctx.isDebugMode || false;
  if (!debug) {
    return html;
  }

  const data = getDebugData(ctx);
  return html.replace(PLACEHOLDER, safeStringify(data));
};

/**
 * safe stringify
 *
 * @param {Record<string, any>} json
 * @return {*}
 */
const safeStringify = (json: Record<string, any>) => {
  return JSON.stringify(json).replace(/<\//g, '<\\/');
};

/**
 * get the debug data
 *
 * @param {Context} ctx
 */
const getDebugData = (ctx: Context): DebugState => {
  return {
    origin: ctx.origin,
    parsedDSL: ctx.page,
    baseInfo: {
      appId: ctx.appId,
      appSlug: ctx.appSlug,
    },
    netInfo: {
      ...ctx.request.headers,
    }, // ctx headers
    variableValue: ctx.variables,
    conditionValue: ctx.conditions,
  };
};
