import { createElement, ReactElement } from 'react';
import ReactDOMServer from 'react-dom/server';

// import ReactIs from 'react-is';
import { Context, PageRenderOption, ParsedDSL, StructureNode, StructureNodeProps } from '@foxpage/foxpage-types';

import { Container } from './components';

type ElementType = ReactElement<StructureNodeProps<any>, string | React.JSXElementConstructor<any>> | null | undefined;

async function build(schemas: StructureNode[], ctx: Context) {
  async function creator(node: StructureNode) {
    try {
      const { id, show = true, type, children = [] } = node;
      if (!show) {
        return null;
      }

      const component = ctx.componentMap?.get(id);
      if (component) {
        const { factory } = component;
        if (!factory) {
          ctx.logger?.warn(`render node ${type}${id} failed, factory is undefined.`);
          return null;
        }

        const childrenElements: ElementType[] = await Promise.all(
          children.length > 0 ? children.map(item => creator(item)) : [],
        );

        let buildHookProps;
        if (typeof factory.beforeNodeBuild === 'function') {
          buildHookProps = await factory.beforeNodeBuild(ctx, node);
        }

        const finalProps = {
          ...node.props,
          ...(buildHookProps || {}),
        };

        const element = createElement(factory, finalProps, ...childrenElements);
        return element;
      }
    } catch (e) {
      ctx.logger?.error('render node %c failed.', node, e);
      return null;
    }
  }

  const elements = await Promise.all(schemas.map(item => creator(item)));

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
    ctx.logger?.error('render page failed:', (e as Error).message);
    return '';
  }
};
