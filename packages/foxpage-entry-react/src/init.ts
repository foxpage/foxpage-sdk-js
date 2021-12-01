import React from 'react';

import { loader as componentLoader } from '@foxpage/foxpage-browser-loader';
import { BrowserStructure } from '@foxpage/foxpage-types';

import { InitialState } from './interface';
import { render } from './render';

function configComponents(state: InitialState) {
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
      { ignoreStyleAsset: true },
    );
  }
}

function createApp(initialState: InitialState) {
  const { root, structureMap = {} } = initialState;
  configComponents(initialState);

  const { StructureLoader } = require('./loaders/structure') as typeof import('./loaders/structure');
  const { App } = require('./components/App') as typeof import('./components/App');

  const structureLoader = new StructureLoader(initialState);
  const rootStructure: BrowserStructure | undefined = structureMap[root as string];

  return structureLoader.loadMulti(rootStructure?.childrenIds).then(children => {
    const element = React.createElement(App, { initialState }, children);
    return { element, structureLoader };
  });
}

export const init = (state: InitialState) => {
  const start = +new Date();

  createApp(state)
    .then(({ element, structureLoader }) => {
      render(element, structureLoader, state);
      console.log('init success. cost:', +new Date() - start);
    })
    .catch(err => {
      console.error('init fail.', err);
    });
};
