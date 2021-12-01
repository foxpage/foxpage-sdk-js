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
    if (dsl && dsl.length > 0) {
      let preparedDSL = prepareDSL(dsl);

      ctx.page.schemas = preparedDSL;
      // load components
      const [components, dependencies] = await loadComponents(preparedDSL, ctx.appId, opt);
      ctx.componentMap = components;
      ctx.dependencies = dependencies;
      ctx.logger?.info('components load completed.');

      let html = '';

      const { beforePageRender, onPageRender, afterPageRender } = ctx.hooks || {};
      if (typeof beforePageRender === 'function') {
        preparedDSL = await beforePageRender(ctx);
      }

      // render
      if (typeof onPageRender === 'function') {
        html = await onPageRender(preparedDSL, ctx);
      } else if (typeof ctx.render === 'function') {
        html = await ctx.render(preparedDSL, ctx);
      } else {
        ctx.logger?.error('render is invalid.');
      }

      if (typeof afterPageRender === 'function') {
        html = await afterPageRender(ctx, html);
      }

      ctx.logger?.info('render html result:', html);
      return html ? DOCTYPE + html : '';
    }
    return '';
  } catch (e) {
    throw new Error(`render error: ${(e as Error).message}`);
  }
};

function prepareDSL(schemas: StructureNode[]) {
  const dsl: StructureNode[] = [];

  schemas.forEach(item => {
    const { show = true, children = [] } = item;
    if (show) {
      dsl.push({ ...item, children: children.length > 0 ? prepareDSL(children) : [] });
    }
  });

  return dsl;
}
