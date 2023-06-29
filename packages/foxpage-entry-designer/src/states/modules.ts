import { Component } from '@foxpage/foxpage-client-types';
import { BrowserModule, FoxpageComponent } from '@foxpage/foxpage-types';

export const generateKey = (name: string, version?: string) => (version ? `${name}@${version}` : name);

export const initModules = (componentMaps: Record<string, Component>, componentNameVersions: string[] = []) => {
  const modules: BrowserModule[] = [];
  let depList: string[] = [];

  const moduleFormat = (list: Component[]) => {
    list.forEach(item => {
      if (item) {
        const { resource, meta, version } = item;
        const { browser, css } = resource?.entry || {};
        const browserURL = browser?.host && browser?.path ? browser.host + browser.path : '';
        const cssURL = css?.host && css?.path ? css.host + css.path : '';
        const _meta = (meta || {}) as FoxpageComponent['meta'];
        if (cssURL) {
          _meta.assets = [{ url: cssURL, type: 'css' }];
        }
        const deps = (resource?.dependencies || []).map(item => item.name);

        modules.push({
          name: item.name,
          version: version,
          url: browserURL,
          deps,
          meta: _meta,
        });
        depList = depList.concat(deps);
      }
    });
  };

  // init components
  const components: Component[] = [];
  componentNameVersions.forEach(item => {
    const component = componentMaps[item];
    if (component) {
      components.push(component);
    }
  });
  moduleFormat(components);

  // init deps
  const depComponents: Component[] = [];
  depList.forEach(item => {
    const component = componentMaps[item];
    if (component) {
      depComponents.push({ ...component, version: '' });
    }
  });
  moduleFormat(depComponents);

  return modules;
};
