import _ from 'lodash';

import { ComponentLoadOption, Context, ParsedDSL, RenderToHTMLOptions, StructureNode } from '@foxpage/foxpage-types';

import { DOCTYPE } from '../common';

import { ComponentLoaderImpl } from './loader';

/**
 * load page component
 * @param schemas page schemas
 * @param app application object
 * @param opt ComponentLoad option
 * @returns {Promise<Map<string, FoxpageComponent>>}
 */
export const loadComponents = async (schemas: StructureNode[], appId: string, opt: ComponentLoadOption) => {
  const loader = new ComponentLoaderImpl(appId, opt);

  await loader.load(schemas);

  const components = _.cloneDeep(loader.getLoadedComponents());
  const dependencies = _.cloneDeep(loader.getLoadedDependencies());

  loader.destroy();

  return [components, dependencies];
};

/**
 * render to html
 * @param dsl page dsl
 * @param ctx render context
 * @param opt render options
 * @returns html string
 */
export const renderToHTML = async (dsl: ParsedDSL['schemas'], ctx: Context, opt: RenderToHTMLOptions) => {
  try {
    ctx.logger?.info('render DSL:', JSON.stringify(dsl));

    if (dsl && dsl.length > 0) {
      const { dsl: newDSL, structureMap } = prepareDSL(dsl);
      let preparedDSL = newDSL;

      ctx.logger?.info('preparedDSL:', JSON.stringify(preparedDSL));

      ctx.page.schemas = preparedDSL;
      ctx.structureMap = structureMap;

      // load components
      const [components, dependencies] = await loadComponents(preparedDSL, ctx.appId, opt);

      ctx.componentMap = components;
      ctx.dependencies = dependencies;

      ctx.logger?.info('components load completed.', JSON.stringify(Array.from(components?.values())));

      let html = '';

      const { beforePageRender, onPageRender, afterPageRender } = ctx.hooks || {};
      if (typeof beforePageRender === 'function') {
        preparedDSL = await beforePageRender(ctx);
      }

      // render
      if (typeof onPageRender === 'function') {
        html = await onPageRender(ctx, preparedDSL);
      } else if (typeof ctx.render === 'function') {
        html = await ctx.render(preparedDSL, ctx);
      } else {
        ctx.logger?.error('render is invalid.');
      }

      if (typeof afterPageRender === 'function') {
        html = await afterPageRender(ctx, html);
      }

      ctx.logger?.debug('render html result:', html);
      ctx.logger?.info('render html ' + (html ? 'succeed.' : 'empty.'));
      return html ? DOCTYPE + html : '';
    }
    return '';
  } catch (e) {
    throw new Error(`render error: ${(e as Error).message} `);
  }
};

/**
 * filter no show node & generate structureMap
 *
 * @param {StructureNode[]} schemas
 * @return {*}
 */

function prepareDSL(schemas: StructureNode[]) {
  const structureMap: Context['structureMap'] = new Map();

  function doPrepare(dsl: StructureNode[]) {
    const newDSL: StructureNode[] = [];

    dsl.forEach(item => {
      const { id, name, type, version, props, show, children = [] } = item;
      if (show) {
        const childList = children.length > 0 ? doPrepare(children) : [];
        // push new dsl nodes
        newDSL.push({ ...item, children: childList });
        // set to structureMap
        structureMap?.set(id, {
          id,
          name,
          version,
          type,
          props,
          childrenIds: childList.map(child => child.id),
        });
      }
    });

    return newDSL;
  }

  const dsl = doPrepare(schemas);

  return { dsl, structureMap };
}
