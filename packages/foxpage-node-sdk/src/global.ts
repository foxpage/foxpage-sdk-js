import { FoxpageRequestOptions } from '@foxpage/foxpage-types';

declare module '@foxpage/foxpage-types' {
  type FoxpageNodeContext = FoxpageRequestOptions;

  export interface Context extends FoxpageNodeContext {}
}
