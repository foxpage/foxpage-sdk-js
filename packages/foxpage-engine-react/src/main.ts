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

type BuildOptions = {
  ssrEnable?: boolean;
};

async function creator(node: StructureNode, ctx: Context, opt: BuildOptions) {
  try {
    const { id, show = true, name, type, version, children = [], props = {} } = node;
    if (!ctx.disableConditionRender && !show) {
      ctx.logger?.info(`node ${name}@${id} not show`);
      return null;
    }

    const component = ctx.componentMap?.get(id);
    if (!component) {
      ctx.logger?.warn(`render node ${name}@${id} component is empty`);
      return null;
    }

    const { factory, meta } = component;

    if (!factory) {
      ctx.logger?.warn(`render node ${name}@${id} failed, factory is undefined.`);
      return null;
    }

    // create children elements
    let childrenElements: ElementType[] = [];
    if (children.length > 0) {
      const { enable = true } = ctx.appConfigs?.ssr || {};
      const { ssrEnable: cusSSREnable = true } = props;
      const { ssrEnable = true } = opt;

      // isCSREntry: mark the csr entry component
      // ssr no enable will not create children elements
      if (!(meta.isCSREntry && (!enable || !cusSSREnable || !ssrEnable))) {
        childrenElements = await Promise.all(children.map(item => creator(item, ctx, opt)));
      }
    }

    // do getInitialProps hook
    let buildHookProps;
    if (typeof factory.beforeNodeBuild === 'function') {
      try {
        buildHookProps = await factory.beforeNodeBuild(ctx, node);
        ctx.logger?.info(`Hook [ buildHookProps ][ ${name} ] success.`);
      } catch (e) {
        ctx.logger?.warn(`Hook [ buildHookProps ][ ${name} ] run failed,`, e);
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
      ...props,
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
  } catch (e) {
    ctx.logger?.error('create element %c failed.', node, e);
    throw e;
  }
}

async function build(schemas: StructureNode[], ctx: Context, opt: BuildOptions) {
  const elements = await Promise.all(schemas.map(item => creator(item, ctx, opt)));
  return elements;
}

/**
 * render
 * @param dsl parsed dsl
 * @param ctx render context
 * @param opt render options
 * @returns html
 */
export const renderToHtml = async (
  dsl: ParsedDSL['schemas'] = [],
  ctx: Context,
  _opt: PageRenderOption & { reRender?: boolean } = {},
): Promise<string> => {
  try {
    if (dsl.length === 0) {
      ctx.logger?.info('parsed schemas is empty');
      return '';
    }

    const { beforePageBuild, afterPageBuild } = ctx.hooks || {};
    if (typeof beforePageBuild === 'function') {
      await beforePageBuild(ctx);
    }

    const opt: BuildOptions = {};
    if (_opt.reRender) {
      opt.ssrEnable = false;
    }

    // build
    const elements = await build(dsl, ctx, opt);
    if (elements.length === 0) {
      ctx.logger?.info('build elements is empty');
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
    ctx.logger?.warn('render page failed:', e);
    if (!_opt.reRender) {
      const csr = Array.from(ctx.componentMap?.values() || [])?.find(item => !!item.meta?.isCSREntry);
      if (csr) {
        ctx.logger?.info('change ssr to csr:');
        _opt.reRender = true;
        return await renderToHtml(dsl, ctx, _opt);
      }
    }
    throw e;
  }
};
