import { ModuleConfigs } from '@foxpage/foxpage-types';

import { addModule, clearCache, createModuleSystem, loadModule } from '../../module';

export type FrameworkOptions = {
  requirejsLink: string;
  libs: ModuleConfigs;
  win?: Window;
};

export function loadFramework(libs: ModuleConfigs) {
  addModule(libs);
  return loadModule(Object.keys(libs));
}

export function initFramework(initialState: FrameworkOptions, opt: { clearCache: boolean } = { clearCache: true }) {
  if (opt.clearCache) {
    clearCache();
  }
  createModuleSystem({
    config: {
      requirejsLink: initialState.requirejsLink,
      win: initialState.win || window,
    },
  });

  // load framework
  return loadFramework(initialState.libs);
}
