import { getConfig, getWindow } from '../config';
import { ModuleLoaderFn } from '../loader';

import { loadAmdModule, loadRequirejs } from './requirejs';

let _preparePromise: Promise<void> | undefined;

export interface UmdModuleSystemOptions {
  requirejsLink?: string;
}

function prepare() {
  if (!_preparePromise) {
    const link = getConfig('requirejsLink');
    _preparePromise = loadRequirejs(link);
  }
  return _preparePromise;
}

export const loadUmdModule: ModuleLoaderFn = mod => {
  const { umdModuleName: amdModuleName = mod.id, define, alias = [] } = mod.config;
  const win = getWindow();
  return prepare()
    .then(() => (define ? define() : loadAmdModule(amdModuleName, { alias, url: mod.url, version: mod.version })))
    .then(exportData => {
      // redefine module for requirejs
      if (typeof win.define === 'function') {
        win.define(amdModuleName, () => exportData);
        alias.forEach(name => {
          (win.define as NonNullable<Window['define']>)(name, () => exportData);
        });
      }
      return exportData;
    });
};

export function destroyUmd() {
  _preparePromise = undefined;
}
