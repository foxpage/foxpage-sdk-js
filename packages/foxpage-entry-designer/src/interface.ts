import { RenderStructure, RenderStructureNode } from '@foxpage/foxpage-client-types';
import { BrowserInitialState, BrowserStructure, FoxpageComponentMeta } from '@foxpage/foxpage-types';

export interface InitialState extends Omit<BrowserInitialState, 'structures'> {
  structures: RenderStructure;
  structureMap: Record<string, RenderStructureNode>;
  componentNameVersions?: string[];
}

export interface AppComponentProps {
  initialState: InitialState;
  children?: React.ReactNode;
}

export interface StructureDetail {
  node: RenderStructureNode;
  meta: FoxpageComponentMeta | undefined;
  mod?: null | Record<string, any>;
  Component: React.ComponentType<any>;
  props: BrowserStructure['props'];
  initialProps?: Record<string, any>;
  injectProps?: Record<string, any>;
}
