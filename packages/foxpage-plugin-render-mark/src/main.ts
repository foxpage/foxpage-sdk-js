import { structure as structureUtils } from '@foxpage/foxpage-core';
import { RenderPageError, renderToHtmlByPageId } from '@foxpage/foxpage-node-sdk';
import { Context, Route, StructureNode } from '@foxpage/foxpage-types';

import { Mark } from './components';

const COMMON_SUFFIX = '/_foxpage';

/**
 * before page render handler
 * @param ctx render context
 * @returns dsl
 */
export const handleBeforePageRender = async (ctx: Context) => {
  const dsl = ctx.page?.schemas;

  if (ctx.isPreviewWithMark) {
    const body = structureUtils.findBody(dsl, ctx);
    if (body) {
      const dfs = (list: StructureNode[] = []) => {
        const newNodes = {} as Record<string, StructureNode>;
        list.forEach((item, idx) => {
          const { structure, component } = structureUtils.createStructureWithFactory(Mark, {
            componentId: item.id,
            componentType: item.name,
            componentName: item.label,
          });
          structure.children = [item];
          newNodes[idx] = structure;
          ctx.componentMap?.set(structure.id, component);

          if (item.children) {
            dfs(item.children);
          }
        });

        // insert
        Object.keys(newNodes).forEach(item => {
          list.splice(Number(item), 1, newNodes[item]);
        });
      };

      dfs(body.children);
    }
  }

  return dsl;
};

/**
 * register router
 * @returns route
 */
export const handleRegisterRouter = async () => {
  return {
    pathname: `${COMMON_SUFFIX}/render-with-mark`,
    action: async (ctx: Context) => {
      try {
        const { appid, pageid } = ctx.request.query as unknown as {
          appid: string;
          pageid: string;
        };
        if (!appid) {
          throw new Error('App id is empty!');
        }
        if (!pageid) {
          throw new Error('page id is empty!');
        }
        ctx.isPreviewWithMark = true;
        ctx.disableConditionRender = true;
        return await renderToHtmlByPageId(pageid, appid, {
          request: ctx.request,
          response: ctx.response,
          cookies: ctx.cookies,
          ctx,
        });
      } catch (e) {
        throw new RenderPageError(new Error(`render page failed: ${(e as Error).message}`), ctx.page);
      }
    },
  } as Route;
};
