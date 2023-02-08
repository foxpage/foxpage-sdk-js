import _ from 'lodash';

import { ComponentLoadOption, Context, ParsedDSL, RenderToHTMLOptions, StructureNode } from '@foxpage/foxpage-types';

import { DOCTYPE } from '../common';

import { ComponentLoaderImpl } from './loader';

const BLANK_NODE = 'system.inherit-blank-node'; // blank node

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
  ctx.logger?.info('render DSL:', JSON.stringify(dsl));

  if (dsl && dsl.length > 0) {
    const { dsl: newDSL, structureMap } = prepareDSL(dsl, ctx);
    let preparedDSL = newDSL;

    ctx.page.schemas = preparedDSL;
    ctx.structureMap = structureMap;

    // load components
    const loadCost = ctx.performanceLogger('componentLoadTime');
    const [components, dependencies] = await loadComponents(preparedDSL, ctx.appId, {
      ...opt,
      isPreviewMode: ctx.isPreviewMode,
    });
    loadCost();

    ctx.componentMap = components;
    ctx.dependencies = dependencies;

    ctx.logger?.info(
      'loaded components: ',
      Array.from(new Set(Array.from(components?.values()).map(item => item.name))),
    );

    let html = '';

    const { beforePageRender, onPageRender, afterPageRender } = ctx.hooks || {};
    if (typeof beforePageRender === 'function') {
      preparedDSL = await beforePageRender(ctx);
      ctx.logger?.info('beforePageRender hook get the dsl: ', JSON.stringify(preparedDSL));
    }

    // render
    if (typeof onPageRender === 'function') {
      html = await onPageRender(ctx, preparedDSL);
      ctx.logger?.info(`onPageRender hook get the html ${htmlStatus(html)}`);
    } else if (typeof ctx.render === 'function') {
      html = await ctx.render(preparedDSL, ctx);
      ctx.logger?.info(`render html ${htmlStatus(html)}`);
    } else {
      ctx.logger?.error('render is invalid.');
    }

    if (typeof afterPageRender === 'function') {
      html = await afterPageRender(ctx, html);
      ctx.logger?.info(`afterPageRender hook get the html ${htmlStatus(html)}`);
    }

    ctx.logger?.info(`rendered html ${htmlStatus(html)}`);
    return html ? DOCTYPE + html : '';
  }
  return '';
};

function htmlStatus(html: string) {
  return html ? 'succeed' : 'empty';
}

/**
 * filter no show node & generate structureMap
 *
 * @param {StructureNode[]} schemas
 * @return {*}
 */

function prepareDSL(schemas: StructureNode[], ctx: Context) {
  const structureMap: Context['structureMap'] = new Map();

  function doPrepare(dsl: StructureNode[]) {
    const newDSL: StructureNode[] = [];

    dsl.forEach(item => {
      const { id, name, label, type, version, props, show, children = [] } = item;
      if ((!ctx.disableConditionRender && !show) || name === BLANK_NODE) {
        ctx.logger?.info(`node ${name}@${id} not show`);
      } else {
        const childList = children.length > 0 ? doPrepare(children) : [];
        // push new dsl nodes
        newDSL.push({ ...item, children: childList });
        // set to structureMap
        structureMap?.set(id, {
          id,
          name,
          label,
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
