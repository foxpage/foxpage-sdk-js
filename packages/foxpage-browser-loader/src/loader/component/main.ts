import { isArray } from '@foxpage/foxpage-shared/lib/common/utils';
import { BrowserModule, FoxpageComponentMeta } from '@foxpage/foxpage-types';

import { addModule, getModule, loadModule } from '../../module';

import { FoxpageComponentType } from './interface';
import { getDefaultExport } from './utils';

export interface ConfigComponentOptions {
  ignoreStyleAsset?: boolean;
}

function extname(filename: string) {
  return filename.substr(filename.lastIndexOf('.') + 1);
}

function findComponentDeps(meta: BrowserModule['meta'], { ignoreStyleAsset = false }: ConfigComponentOptions = {}) {
  const { assets, softDeps = [] } = meta;
  const deps: string[] = [].concat(softDeps);

  if (assets) {
    for (let i = 0; i < assets.length; i++) {
      const asset = assets[i];
      const { url } = asset;
      if (url) {
        const type = asset.type || extname(url);
        switch (type) {
          case 'css':
            if (!ignoreStyleAsset) {
              const name = `css_${url}`;
              addModule(name, { type: 'css', url });
              deps.push(name);
            }
            break;
          case 'js':
            const name = `js_${url}`;
            addModule(name, { type: 'js', url });
            deps.push(name);
            break;
        }
      }
    }
  }
  return deps;
}

function _configComponent(mod: BrowserModule, opt: ConfigComponentOptions) {
  const { name, version, url, deps = [], meta = {} } = mod;
  const softDeps = findComponentDeps(meta, opt);
  const nameWithVersion = `${name}@${version}`;
  // for support module deps, one page may exist one module multi versions
  // each module umd name will include version, like "demo.comp@0.2.2"
  // compatible old umd module which name exclude version, like: "demo.comp"
  // we use "moduleNameWithVersion" in component meta to diff, and alias
  const umdModuleName = (meta?.moduleNameWithVersion || 1) > 1 ? nameWithVersion : name;
  addModule(name, {
    url,
    version,
    umdModuleName,
    alias: [nameWithVersion, name],
    deps,
    softDeps,
    injectWindow: nameWithVersion,
    meta,
  });
}

export function configComponent(modOrList: BrowserModule | BrowserModule[], opt: ConfigComponentOptions = {}) {
  if (isArray(modOrList)) {
    modOrList.forEach(mod => _configComponent(mod, opt));
  } else {
    _configComponent(modOrList, opt);
  }
}

export function loadComponent(type: string, version?: string): Promise<FoxpageComponentType> {
  return loadModule(type, version).then(exported => {
    const componentFactory = getDefaultExport(exported);
    if (!componentFactory) {
      throw new Error(`component ${type} load fail, :${version || ''} get undefined`);
    }
    componentFactory.displayName = `${type}@${version || ''}`;
    return componentFactory;
  });
}

export function getComponentModule(type: string, version?: string) {
  const f = getModule(type, version);
  return f
    ? {
        type,
        version,
        factory: getDefaultExport(f.exports) as FoxpageComponentType,
        meta: f.meta as FoxpageComponentMeta | undefined,
      }
    : null;
}
