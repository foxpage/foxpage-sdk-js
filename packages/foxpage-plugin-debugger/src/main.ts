import { structure as structureUtils } from '@foxpage/foxpage-core';
import { Context } from '@foxpage/foxpage-types';

import { DebugEntry, DebugPlaceholder, PLACEHOLDER } from './components';
import { DebugState } from './interface';

/**
 * before page render handler
 * note: the debugger must deps the head & body node
 * @param ctx context
 * @returns
 */
export const handleBeforePageRender = async (ctx: Context) => {
  const debug = ctx.isDebugMode || false;
  const dsl = ctx.page?.schemas;
  if (debug) {
    const head = structureUtils.findHead(dsl, ctx);
    const body = structureUtils.findBody(dsl, ctx);
    if (head && body) {
      const headResult = structureUtils.createStructureWithFactory(DebugPlaceholder, {});
      structureUtils.appendStructure(head, headResult.structure, headResult.component, ctx);

      const bodyResult = structureUtils.createStructureWithFactory(DebugEntry, {
        url: ctx.settings?.debugger.url || '/debug.js',
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
