import { ModuleConfig } from '@foxpage/foxpage-types';

import { IModuleLoader, IModuleSystem } from './interface';
import { ModuleLoader } from './loader';
import { generateModuleId } from './utils';

export class ModuleGraph implements IModuleSystem {
  map: Record<string, IModuleLoader> = {};

  get(moduleName: string, version?: string): ReturnType<IModuleSystem['get']> {
    const id = this.findModuleId(moduleName, version);
    return id ? this.map[id] : undefined;
  }

  add<T = unknown>(moduleName: string, config: ModuleConfig<T>): this {
    const id = generateModuleId(moduleName, config.version);
    if (!this.map[id]) {
      this.map[id] = new ModuleLoader(moduleName, config, id);
    } else {
      this.map[id].update(config);
    }
    return this;
  }

  load<T = any>(moduleName: string, version?: string): Promise<T> {
    const id = this.findModuleId(moduleName, version);
    return id ? this._load<T>(id) : Promise.reject(`can't find module ${moduleName}:${version}}`);
  }

  private _load<T = any>(id: string): Promise<T> {
    const loader = this.map[id];
    if (loader) {
      const { deps = [], softDeps = [] } = loader;
      const loadSoftDepPromise: Promise<any> = softDeps.length ? this.loadDeps(softDeps) : Promise.resolve();
      const loadPromise: Promise<T> = deps.length ? this.loadDeps(deps).then(() => loader.load()) : loader.load();
      return Promise.all([loadPromise, loadSoftDepPromise]).then(([res]) => res);
    }
    return Promise.reject(new Error(`miss config for module ${id}`));
  }

  private loadDeps(deps: string[]) {
    return Promise.all(
      deps.map(dep =>
        this._load(dep).catch((err: Error) => {
          err.message = `load dependency "${dep}" fail: ${err.message}`;
          throw err;
        }),
      ),
    );
  }

  private findModuleId(moduleName: string, version?: string) {
    let id = generateModuleId(moduleName, version);
    if (!(id in this.map)) {
      const modules = Object.values(this.map).filter(mod => mod.name === moduleName);
      if (modules.length === 1) {
        id = modules[0].id;
      }
    }
    return id in this.map ? id : null;
  }
}
