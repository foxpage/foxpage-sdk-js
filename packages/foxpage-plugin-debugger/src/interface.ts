import { Context as KoaContext } from 'koa';

import { ContextOrigin, Page, RequestMode } from '@foxpage/foxpage-types';

declare module '@foxpage/foxpage-types' {
  export interface Context extends RequestMode, KoaContext {}
}

export interface DebugState {
  origin: ContextOrigin;
  parsedDSL: Page;
  baseInfo: {
    appId: string;
    appSlug: string;
  };
  netInfo: Record<string, any>;
  variableValue?: Record<string, any>;
  conditionValue?: Record<string, any>;
}
