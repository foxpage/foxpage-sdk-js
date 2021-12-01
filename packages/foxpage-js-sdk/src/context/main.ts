import { RenderAppInfo } from '@foxpage/foxpage-types';
import { Context } from '@foxpage/foxpage-types';

import { RenderContextInstance } from './render';

/**
 * init render context
 * @param appInfo application info
 * @returns render context
 */
export const createRenderContext = (appInfo: RenderAppInfo) => {
  const ctx = new RenderContextInstance(appInfo) as Context;
  return ctx;
};
