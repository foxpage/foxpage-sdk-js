import { ReactElement } from 'react';

import _ from 'lodash';
import { ServerStyleSheet } from 'styled-components';

import { structure as structureUtils } from '@foxpage/foxpage-core';
import { Context, StructureNode } from '@foxpage/foxpage-types';

import { HeadConsumer } from './components/HeadConsumer';
import { InnerHTML } from './components/InnerHTML';
import { findStructure } from './utils';
const { appendStructure, createStructureWithFactory } = structureUtils;

/**
 * create elements with styled-components
 *
 * @param ctx context
 * @param elements created elements
 * @returns new elements
 */
export const createElements = (ctx: Context, elements: ReactElement[]) => {
  ctx.sheet = new ServerStyleSheet();
  try {
    const reactElementWithStyle = ctx.sheet.collectStyles(elements);
    return reactElementWithStyle;
  } catch (error) {
    ctx.sheet.seal();
    ctx.logger?.warn('create elements with styled components fail.', error);
    throw error;
  } finally {
    ctx.sheet.seal();
  }
};

/**
 * render with styled-components
 * will collect styled-components content
 * @param ctx context
 * @param elements created elements
 * @returns collected result
 */
export const renderWithStyledComponents = async (ctx: Context) => {
  // for avoid pollute the origin dsl
  const dsl = _.cloneDeep(ctx.page.schemas);

  const bodyChildren = findBody(dsl, ctx);
  if (!bodyChildren) {
    return dsl;
  }

  const html = await render(bodyChildren.children, ctx);

  // handle body node
  // set new structure for avoid render again
  handleBodyNode(bodyChildren, { html }, ctx);

  const styleElements: ReactElement[] = [];
  if (ctx.sheet) {
    styleElements.push(...ctx.sheet.getStyleElement());
    ctx.sheet.seal();
  }
  handleHeadNode(ctx, styleElements);

  return dsl;
};

/**
 * render to html
 *
 * @param {StructureNode[]} [dsl=[]]
 * @param {Context} ctx
 * @return {*}
 */
async function render(dsl: StructureNode[] = [], ctx: Context) {
  if (typeof ctx.render === 'function') {
    return await ctx.render(dsl, ctx);
  } else {
    ctx.logger?.error('render is invalid.');
  }
  return '';
}

function handleBodyNode(node: StructureNode, value: { html: string }, ctx: Context) {
  const { structure, component } = createStructureWithFactory(InnerHTML, { tag: 'div', ...value });
  // for set new children
  node.children = [];
  appendStructure(node, structure, component, ctx);
}

function handleHeadNode(ctx: Context, styleElements: ReactElement[]) {
  const headNode = findHead(ctx.page.schemas, ctx);
  if (!headNode) {
    return;
  }
  const { structure, component } = createStructureWithFactory(HeadConsumer, { styleElements });
  appendStructure(headNode, structure, component, ctx);
}

function findBody(dsl: StructureNode[], ctx: Context) {
  return findStructure(dsl, ctx, 'isBody');
}

function findHead(dsl: StructureNode[], ctx: Context) {
  return findStructure(dsl, ctx, 'isHead');
}
