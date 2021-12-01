import { ModuleConfig } from '@foxpage/foxpage-types';

import { loadScriptModule, loadStyleModule } from './loaders/asset';
import { loadUmdModule } from './loaders/umd';
import { getWindow } from './config';
import { IModuleLoader, ModuleStatus } from './interface';
import { generateModuleId } from './utils';

export interface ModuleLoaderFn {
  (mod: Omit<IModuleLoader, 'url'> & { url: string }): Promise<any>;
}

const LOADERS: Record<Required<ModuleConfig>['type'], ModuleLoaderFn> = {
  css: loadStyleModule,
  js: loadScriptModule,
  umd: loadUmdModule,
};

const abstractLoader: ModuleLoaderFn = mod => {
  return Promise.reject(new Error(`module ${mod.id} can't load.`));
};

export class ModuleLoader<T = any> implements IModuleLoader<T> {
  id: string;
  name: string;
  type: NonNullable<ModuleConfig['type']>;
  version: string | undefined;
  config: ModuleConfig;
  deps: string[] = [];
  softDeps: string[] = [];
  exports: T | undefined | null = undefined;
  meta?: Record<string, any>;
  status: ModuleStatus = 'create';
  customLoader?: () => Promise<T>;
  loader: ModuleLoaderFn;
  url?: string | undefined;
  error?: Error;
  private _loadPromise?: Promise<T | undefined | null>;

  constructor(name: string, config = {} as ModuleConfig, id = generateModuleId(name, config.version)) {
    const { version } = config;
    this.name = name;
    this.version = version;
    this.id = id;
    this.config = config;
    this.type = config.type || 'umd';
    this.loader = LOADERS[this.type] || abstractLoader;
    this.update(config);
  }

  update(config: ModuleConfig<T>) {
    if (this.loaded) {
      return;
    }
    const { url, deps = [], softDeps = [] } = config;
    Object.assign(this.config, config);
    this.deps = deps;
    this.softDeps = softDeps;
    this.url = url;
    this.customLoader = config.load;
    this.meta = config.meta;
  }

  get loaded() {
    return !!this._loadPromise;
  }

  get enable() {
    return this.status === 'success';
  }

  load() {
    if (!this._loadPromise) {
      this.status === 'pending';
      this._loadPromise = this._load()
        .then(exportData => {
          console.debug(`module "${this.id}" export:`, exportData);
          this.exports = exportData;
          this.status = 'success';
          if (this.config.injectWindow) {
            const win = getWindow();
            win[this.config.injectWindow] = exportData;
          }
          return exportData;
        })
        .catch(err => {
          this.status = 'fail';
          this.error = err;
          return undefined;
        });
    }
    return this._loadPromise;
  }

  private _load(): Promise<T | undefined | null> {
    if (this.status === 'success') {
      return Promise.resolve(this.exports);
    }
    if (this.customLoader) {
      return Promise.resolve(this.customLoader());
    }
    return this.loader(this as any);
  }
}
