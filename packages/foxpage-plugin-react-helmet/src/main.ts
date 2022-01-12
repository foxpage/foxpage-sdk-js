import _ from 'lodash';

import { structure as structureUtils } from '@foxpage/foxpage-core';
import { Context, StructureNode } from '@foxpage/foxpage-types';

import { InnerHTML } from './components/InnerHTML';
import { HeadManager } from './head-manager';
import { findStructure } from './utils';
const { appendStructure, createStructureWithFactory } = structureUtils;

/**
 * create a head manager set to context
 * @param ctx context
 */
export const createHeadManager = (ctx: Context) => {
  // if (ctx.frameworkResource) {
  //   if (!ctx.frameworkResource.libs) {
  //     ctx.frameworkResource.libs = {};
  //   }
  //   ctx.frameworkResource.libs['react-helmet'] = {
  //     injectWindow: 'Helmet',
  //     umdModuleName: 'react-helmet',
  //     url: 'https://www.unpkg.com/react-helmet@6.1.0/lib/Helmet.js',
  //   };
  // }

  ctx.headManager = new HeadManager();
};

/**
 * render page with helmet
 * @param ctx context
 * @returns render result: html string
 */
export const renderWithHelmet = async (ctx: Context) => {
  // for avoid pollute the origin dsl
  const dsl = _.cloneDeep(ctx.page.schemas);

  const mountPoint = getMountPointNode(dsl, ctx);
  // no mount point node
  if (mountPoint) {
    const mountPointHtml = await render(mountPoint.children, ctx);

    // to collect from helmet
    // all collected will be managed by headManager
    // eg.: css link, title, meta, script, style ...
    ctx.headManager.collectFromHelmet();

    // handle mount point node
    // set new structure for avoid render again
    handleMountPointNode(mountPoint, { html: mountPointHtml }, ctx);

    // handle head node render
    handleHeadNode(ctx, dsl);
  }

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

function handleMountPointNode(node: StructureNode, value: { html: string }, ctx: Context) {
  const { structure, component } = createStructureWithFactory(InnerHTML, { tag: 'div', ...value });
  // for set new children
  node.children = [];
  appendStructure(node, structure, component, ctx);
}

function handleHeadNode(ctx: Context, dsl: Context['page']['schemas']) {
  const { headManager } = ctx;
  headManager.collectComponentResources(ctx);
  headManager.outputToDSL(ctx, dsl);
}

/**
 * get the mountNode
 * current default use "isBody" meta
 * @param {Context} ctx
 */
function getMountPointNode(dsl: StructureNode[], ctx: Context) {
  const headNode = findStructure(dsl, ctx, 'isBody');
  return headNode;
}
