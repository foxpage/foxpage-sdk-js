import { HeadManager } from '../head-manager';

declare module '@foxpage/foxpage-types' {
  interface HelmetContext {
    headManager: HeadManager;
  }
  export interface Context extends HelmetContext {}
}
