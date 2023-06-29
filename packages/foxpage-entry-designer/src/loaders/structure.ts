import { createElement, ReactElement } from 'react';

import { loader as componentLoader } from '@foxpage/foxpage-browser-loader';
import { RenderStructureNode } from '@foxpage/foxpage-client-types';
import { BrowserStructure, Context, FoxpageStaticComponent, StructureNode } from '@foxpage/foxpage-types';

import { Structure } from '../components';
import { InitialState, StructureDetail } from '../interface';

import { getState } from './initial-state';

export class StructureLoader {
  private structureMap: InitialState['structureMap'];
  public errors: any[] = [];

  constructor(initialState: InitialState) {
    this.structureMap = initialState.structureMap || {};
  }

  public load(id: string): Promise<ReactElement | null> {
    const node = this.structureMap[id];
    const { __editorConfig, __renderProps } = (node || {}) as unknown as RenderStructureNode;
    const { visible = true } = __editorConfig || {};
    if (!node || !visible) {
      return Promise.resolve(null);
    }
    const { name = '', version, childIds = [], props = {} } = node;
    const childrenLoadPromise = this.loadMulti(childIds);

    return Promise.all([componentLoader.loadComponent(name, version), childrenLoadPromise])
      .then(([componentFactory, childElements = []]) => {
        if (!componentFactory) {
          throw new Error(`component ${name} miss factory or childElements`);
        }

        return getInitialProps(componentFactory, node).then(result => {
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
            return createElement(
              Structure,
              {
                key: id,
                // ...props,
                ...__renderProps,
                ...initialProps,
                __detail: detail,
              } as BrowserStructure['props'],
              ...childElements,
            );
          };

          return create(result);
        });
      })
      .catch(err => {
        this.errors.push(err);
        console.error('load structure fail', node, err);
        return null;
      });
  }

  public loadMulti(ids: string[] = []) {
    const promises = ids.map(id => this.load(id));
    return Promise.all(promises) as Promise<Array<ReactElement | null>>;
  }
}

/**
 * get initial props
 * @param Component
 * @param node
 * @returns
 */
const getInitialProps = async (Component: React.ComponentType<any>, node: RenderStructureNode) => {
  const states = getState();

  const hook = (Component as FoxpageStaticComponent)?.beforeNodeBuild;
  if (typeof hook === 'function') {
    try {
      const ctx = {
        locale: states.page?.locale,
      } as unknown as Context;
      const nodeInfo: StructureNode = {
        id: node.id,
        name: node.name,
        label: node.label || node.name,
        type: node.type as 'react.component',
        props: Object.assign({}, node.props, (node as unknown as RenderStructureNode).__renderProps),
      };
      const result = await hook(ctx, nodeInfo);
      return result;
    } catch (e) {
      console.log('request hook failed:', e);
    }
  }

  return {};
};
