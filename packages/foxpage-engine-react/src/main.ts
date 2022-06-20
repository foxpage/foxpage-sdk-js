import { createElement, ReactElement } from 'react';
import ReactDOMServer from 'react-dom/server';

import { cloneDeep } from 'lodash';

import {
  ComponentNodeInjectProps,
  Context,
  PageRenderOption,
  ParsedDSL,
  StructureNode,
  StructureNodeProps,
} from '@foxpage/foxpage-types';

import { Container } from './components';

type ElementType = ReactElement<StructureNodeProps<any>, string | React.JSXElementConstructor<any>> | null | undefined;

const initInjectProps = (node: StructureNode, ctx: Context): ComponentNodeInjectProps => {
  const comp = node && ctx.componentMap?.get(node.name);
  return {
    $locale: ctx.locale,
    $runtime: {
      isServer: true,
      isBrowser: false,
      clientType: 'server',
    },
    $eid: node.id,
    $ename: node.name,
    $elabel: node.label,
    $etype: node.type,
    $dsl: {
      appId: ctx.appId,
      id: ctx.page.id,
      name: ctx.origin.page?.name,
      fileId: ctx.origin.page?.fileId,
      version: ctx.origin.page?.versionNumber,
      structure: {
        id: node.id,
        name: node.name,
        label: node.label,
        type: node.type,
        version: comp?.version,
      },
    },
  };
};

async function creator(node: StructureNode, ctx: Context) {
  try {
    const { id, show = true, name, type, version, children = [] } = node;
    if (!ctx.disableConditionRender && !show) {
      return null;
    }

    const component = ctx.componentMap?.get(id);
    if (component) {
      const { factory } = component;
      if (!factory) {
        ctx.logger?.warn(`render node ${name}@${id} failed, factory is undefined.`);
        return null;
      }

      const childrenElements: ElementType[] =
        children.length > 0 ? await Promise.all(children.map(item => creator(item, ctx))) : [];

      let buildHookProps;
      if (typeof factory.beforeNodeBuild === 'function') {
        try {
          buildHookProps = await factory.beforeNodeBuild(ctx, node);
          ctx.logger?.info(`Hook [ buildHookProps ][ ${name} ] success.`);
        } catch (e) {
          ctx.logger?.error(`Hook [ buildHookProps ][ ${name} ] run failed,`, e);
        }
      }

      // injector
      const injector = {
        id,
        type,
        name,
        version,
      };

      // merge props
      const finalProps = {
        $injector: injector,
        ...initInjectProps(node, ctx),
        ...node.props,
        ...(cloneDeep(buildHookProps) || {}),
      };

      // important
      // for update final props to component
      // for csr render get the right data
      const structure = ctx.structureMap?.get(id);
      if (structure) {
        structure.props = Object.assign({}, finalProps);
      }

      const element = createElement(factory, finalProps, ...childrenElements);
      return element;
    }
  } catch (e) {
    ctx.logger?.error('render node %c failed.', node, e);
    return null;
  }
}

async function build(schemas: StructureNode[], ctx: Context) {
  const elements = await Promise.all(schemas.map(item => creator(item, ctx)));
  return elements;
}

/**
 * render
 * @param dsl parsed dsl
 * @param ctx render context
 * @param opt render options
 * @returns html
 */
export const renderToHtml = async (dsl: ParsedDSL['schemas'] = [], ctx: Context, _opt?: PageRenderOption) => {
  try {
    if (dsl.length === 0) {
      ctx.logger?.debug('parsed schemas is empty');
      return '';
    }

    const { beforePageBuild, afterPageBuild } = ctx.hooks || {};
    if (typeof beforePageBuild === 'function') {
      await beforePageBuild(ctx);
    }

    // build
    const elements = await build(dsl, ctx);
    if (elements.length === 0) {
      ctx.logger?.debug('build elements is empty');
      return '';
    }

    // create
    let rootElement = createElement(Container, { ctx }, ...elements);

    if (typeof afterPageBuild === 'function') {
      rootElement = await afterPageBuild(ctx, rootElement);
    }

    // render
    const html: string = ReactDOMServer.renderToStaticMarkup(rootElement);

    return html;
  } catch (e) {
    ctx.logger?.error('render page failed:', e);
    return '';
  }
};
