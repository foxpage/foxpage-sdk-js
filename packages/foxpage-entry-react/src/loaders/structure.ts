import { createElement, ReactElement } from 'react';

import { loader as componentLoader } from '@foxpage/foxpage-browser-loader';
import { BrowserStructure, ComponentNodeInjectProps } from '@foxpage/foxpage-types';

import { Structure, StructureDetail } from '../components';
import { InitialState } from '../interface';

const initInjectProps = (node: BrowserStructure, state: InitialState): ComponentNodeInjectProps => {
  const comp = node && state.modules.find(item => item.name === node.name);
  return {
    $locale: state.page.locale,
    $runtime: {
      isServer: false,
      isBrowser: true,
      clientType: 'client',
    },
    $eid: node.id,
    $ename: node.name,
    $elabel: node.label,
    $etype: node.type,
    $dsl: {
      appId: state.page.appId,
      id: state.page.pageId,
      name: state.page.name,
      fileId: state.page.fileId,
      version: state.page.version,
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

export class StructureLoader {
  private state: InitialState;
  private structureMap: InitialState['structureMap'];
  public errors: any[] = [];

  constructor(initialState: InitialState) {
    this.state = initialState;
    this.structureMap = initialState.structureMap || {};
  }

  public load(id: string): Promise<ReactElement | null> {
    const node = this.structureMap[id];
    if (!node) {
      return Promise.resolve(null);
    }

    const { name = '', version, childrenIds = [], props = {} } = node;
    // const lazyChildren = !!(componentMeta && componentMeta.lazyChildren);
    // const childrenLoadPromise = lazyChildren ? Promise.resolve([]) : this.loadMulti(childrenId);
    const childrenLoadPromise = this.loadMulti(childrenIds);

    return Promise.all([componentLoader.loadComponent(name, version), childrenLoadPromise])
      .then(([componentFactory, childElements = []]) => {
        if (!componentFactory) {
          throw new Error(`component ${name} miss factory or childElements`);
        }

        const create = (initialProps?: Record<string, any>) => {
          const module = componentLoader.getComponentModule(name);
          const injectProps = initInjectProps(node, this.state);
          const detail: StructureDetail = {
            node,
            mod: module,
            Component: componentFactory,
            props: props,
            injectProps,
            initialProps,
            meta: module?.meta,
          };
          let element: React.ReactElement<any> | null = null;

          element = createElement(
            Structure,
            {
              key: id,
              ...injectProps,
              ...props,
              __detail: detail,
            } as BrowserStructure['props'],
            ...childElements,
          );

          return element;
        };

        return create();
      })
      .catch(err => {
        this.errors.push(err);
        console.warn('load structure fail', node, err);
        return null;
      });
  }

  public loadMulti(ids: string[]) {
    const promises = ids.map(id => this.load(id));
    return Promise.all(promises) as Promise<Array<ReactElement | null>>;
  }
}
