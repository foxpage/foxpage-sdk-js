import { StructureNode } from '../structure';
import { FoxpageComponent } from '../component';

export interface ModuleConfig<T = any, M extends Record<string, any> = Record<string, any>> {
  version?: string;
  deps?: string[];
  // allow load same
  softDeps?: string[];
  type?: 'umd' | 'css' | 'js';

  url?: string;
  define?: () => T;
  // custom load fn
  load?: () => Promise<T>;
  injectWindow?: string;

  // for umd module
  umdModuleName?: string;
  alias?: string[];

  // store module external info
  meta?: M;
}

export type ModuleConfigs = Record<string, ModuleConfig>;

export interface BrowserInitialStateOption {
  renderMethod: 'hydrate' | 'render';
}

export interface BrowserInitialStatePage {
  appId: string;
  slug: string;
  pageId: string;
  name?: string;
  locale?: string;
  fileId?: string;
  version?: string;
}

export interface BrowserResource {
  requirejsLink: string;
  libs: ModuleConfigs;
}

export interface BrowserModule extends Pick<FoxpageComponent, 'name' | 'version' | 'meta'> {
  url: string;
  deps?: string[];
}

export interface BrowserStructure extends StructureNode {
  childrenIds: string[];
}

export interface BrowserInitialState {
  root: string;
  page: BrowserInitialStatePage;
  modules: BrowserModule[];
  structures: BrowserStructure[];
  resource: BrowserResource;
  option: BrowserInitialStateOption;
}

