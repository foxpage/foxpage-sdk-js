import { FoxpageRequestOptions } from './api';

declare module '@foxpage/foxpage-types' {
  type FoxpageNodeContext = FoxpageRequestOptions;

  export interface Context extends FoxpageNodeContext {}
}
