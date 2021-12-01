import { createElement, ReactElement } from 'react';

import { loader as componentLoader } from '@foxpage/foxpage-browser-loader';
import { BrowserStructure } from '@foxpage/foxpage-types';

import { Structure, StructureDetail } from '../components';
import { InitialState } from '../interface';

export class StructureLoader {
  private structureMap: InitialState['structureMap'];
  public errors: any[] = [];

  constructor(initialState: InitialState) {
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
          const detail: StructureDetail = {
            node,
            mod: module,
            Component: componentFactory,
            props: props,
            initialProps,
            meta: module?.meta,
          };
          let element: React.ReactElement<any> | null = null;

          element = createElement(
            Structure,
            {
              key: id,
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
