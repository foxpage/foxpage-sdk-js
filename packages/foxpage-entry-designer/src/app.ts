import React from 'react';

import { loader as componentLoader } from '@foxpage/foxpage-browser-loader';

import { NodesStore } from './states/nodes';
import { InitialState } from './interface';

export function configComponents(state: InitialState) {
  const modules = Object.values(state.modules);
  for (let index = 0; index < modules.length; index++) {
    const mod = modules[index];
    const { url, version = '' } = mod;
    componentLoader.configComponent(
      {
        ...mod,
        url,
        version,
      },
      // { ignoreStyleAsset: false },
    );
  }
}

export function createApp(initialState: InitialState) {
  const { structureMap = {}, structures } = initialState;
  console.info('before create', initialState);
  configComponents(initialState);
  NodesStore.clean();

  const { StructureLoader } = require('./loaders/structure') as typeof import('./loaders/structure');
  const { App } = require('./components/App') as typeof import('./components/App');

  if (Object.keys(structureMap).length === 0) {
    const element = React.createElement(App, { initialState }, []);
    return Promise.resolve({ element });
  }

  const structureLoader = new StructureLoader(initialState);

  const rootIds = structures.filter(item => !item.extension?.parentId).map(item => item.id);

  return structureLoader.loadMulti(rootIds).then(children => {
    const element = React.createElement(App, { initialState }, children);
    return { element };
  });
}
