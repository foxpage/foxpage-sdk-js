import { eachObject } from '@foxpage/foxpage-shared/lib/common/utils';
import { ModuleConfig } from '@foxpage/foxpage-types';

import { destroyLoadRequire } from './loaders/requirejs';
import { destroyUmd } from './loaders/umd';
import { Config, getWindow, setConfig } from './config';
import { ModuleGraph } from './graph';
import { IModuleSystem } from './interface';

export interface CreateModuleSystemOptions {
  config?: Partial<Config>;
}

declare global {
  interface Window {
    __FOXPAGE_MODULE_SYSTEM__: any;
  }
}

let moduleSystem = new ModuleGraph() as IModuleSystem;

export function createModuleSystem(opt: CreateModuleSystemOptions): IModuleSystem {
  opt.config && configModuleSystem(opt.config);
  const win = getWindow();
  const newModuleSystem: IModuleSystem = (win.__FOXPAGE_MODULE_SYSTEM__ =
    win.__FOXPAGE_MODULE_SYSTEM__ || moduleSystem || new ModuleGraph());
  moduleSystem = newModuleSystem;
  return newModuleSystem;
}

export function destroyModuleSystem() {
  moduleSystem = new ModuleGraph();
  const win = getWindow();
  win.__FOXPAGE_MODULE_SYSTEM__ = null;
}

export function clearCache() {
  destroyModuleSystem();
  destroyUmd();
  destroyLoadRequire();
}

export function addModule(mods: Record<string, ModuleConfig>): void;
export function addModule(name: string, opt: ModuleConfig): void;
export function addModule(nameOrMods: string | Record<string, ModuleConfig>, opt?: ModuleConfig): void {
  if (typeof nameOrMods === 'string') {
    moduleSystem.add(nameOrMods, opt as ModuleConfig);
    return;
  }

  eachObject(nameOrMods, (config, moduleName) => {
    moduleSystem.add(moduleName, config);
  });
}

export function loadModule(list: string[]): Promise<any[]>;
export function loadModule<T = any>(name: string, ver?: string): Promise<T>;
export function loadModule(nameOrList: string | string[], ver?: string) {
  if (typeof nameOrList === 'string') {
    return moduleSystem.load(nameOrList, ver);
  }
  return Promise.all(nameOrList.map(modName => moduleSystem.load(modName)));
}

export function getModule(name: string, ver?: string) {
  return moduleSystem.get(name, ver);
}

export function configModuleSystem(opt: Partial<Config>) {
  setConfig(opt);
}
