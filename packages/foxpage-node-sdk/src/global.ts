import { RequestMode } from '@foxpage/foxpage-types';

import { FoxpageRequestOptions } from './api';

declare module '@foxpage/foxpage-types' {
  type FoxpageNodeContext = FoxpageRequestOptions;

  export interface Context extends FoxpageNodeContext, RequestMode {}
}
