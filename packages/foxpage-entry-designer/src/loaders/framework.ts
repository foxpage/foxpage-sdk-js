import { loader } from '@foxpage/foxpage-browser-loader';

import { InitialState } from '../interface';

export function initFramework(initialState: InitialState) {
  // load framework
  return loader.initFramework({
    requirejsLink: initialState.resource.requirejsLink,
    libs: initialState.resource.libs,
  });
}
