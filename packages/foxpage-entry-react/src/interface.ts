import { BrowserInitialState, BrowserStructure } from '@foxpage/foxpage-types';

export interface InitialState extends BrowserInitialState {
  structureMap: Record<string, BrowserStructure>;
}
