import { Helmet, HelmetData } from 'react-helmet';

import { flatten } from 'lodash';

import { structure as structureUtils } from '@foxpage/foxpage-core';
import { isNotNill } from '@foxpage/foxpage-shared';
import { Context } from '@foxpage/foxpage-types';

import { HeadConsumer } from './components/HeadConsumer';

const { appendStructure, createStructureWithFactory, findHead } = structureUtils;

type HelmetComponent = ReturnType<HelmetData['noscript']['toComponent']>;

const helmetDataKeys: Array<keyof Omit<HelmetData, 'bodyAttributes' | 'htmlAttributes'>> = [
  'title',
  'base',
  'meta',
  'link',
  'script',
  'style',
  'noscript',
];

export class HeadManager {
  // collect helmet data
  public helmetDataSource: HelmetData[] = [];

  // component dep css link
  public cssURLList: Set<string> = new Set();

  // component dep js link
  public jsURLList: Set<string> = new Set();

  // preload
  public preloadResources: Array<{ href: string; as: 'script' | 'style' }> = [];

  private hasOutput = false;

  public addPreloadResource(href: string, as: 'script' | 'style') {
    this.preloadResources.push({
      href,
      as,
    });
  }

  public collectComponentResources(ctx: Context) {
    const assets = findComponentAssets(ctx.componentMap);
    const { css, js } = getResourceLinks(assets);
    this.cssURLList = css;
    this.jsURLList = js;
  }

  public collectFromHelmet() {
    // always call renderStatic method after renderToStaticMarkup
    // avoid memory leak.
    const data = Helmet.renderStatic();
    this.helmetDataSource.push(data);
  }

  public outputToDSL(ctx: Context, dsl: Context['page']['schemas']) {
    if (this.hasOutput) {
      return;
    }

    const headNode = findHead(dsl, ctx);
    if (!headNode) {
      return;
    }
    const { structure, component } = createStructureWithFactory(HeadConsumer, { manager: this });
    appendStructure(headNode, structure, component, ctx);

    this.hasOutput = true;
  }

  public getHelmetData() {
    const helmetComponents = this.helmetDataSource.reduce((comps, helmetData) => {
      for (const key of helmetDataKeys) {
        const comp = helmetData[key].toComponent();
        if (Array.isArray(comp)) {
          const _list = comp.filter(item => item && item.key);
          if (_list.length) {
            comps.push(..._list);
          }
        } else if (comp) {
          comps.push(comp);
        }
      }
      return comps;
    }, [] as HelmetComponent[]);
    return helmetComponents;
  }

  public destroy() {
    this.cssURLList.clear();
    this.jsURLList.clear();
    this.preloadResources = [];
    this.helmetDataSource = [];
  }

  public toJSON() {
    return {
      cssLinks: [...this.cssURLList],
      jsLinks: [...this.jsURLList],
      preloadResources: this.preloadResources,
      helmetComponents: this.getHelmetData(),
    };
  }
}

function findComponentAssets(componentMap: Context['componentMap'] = new Map()) {
  const components = Array.from(componentMap.values());
  const resources = components.map(comp => comp.meta?.assets).filter(isNotNill);
  return flatten(resources);
}

/**
 * get source link
 * contains css & js link
 * @param assets
 * @param ctx
 */
export function getResourceLinks(assets: { type: 'css' | 'js'; url: string }[]) {
  const urls = {
    js: new Set<string>(),
    css: new Set<string>(),
  };
  for (const { type, url } of assets) {
    if (type !== 'css' && type !== 'js') {
      continue;
    }
    if (url) {
      type === 'css' ? urls.css.add(url) : urls.js.add(url);
    }
  }
  return urls;
}
