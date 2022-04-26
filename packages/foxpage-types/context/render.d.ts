import * as url from 'url';
import { FoxpageComponent } from '../component';
import { Package, Tag, Page, Template, Variable, Condition, FPFunction, RelationInfo } from '../manager';
import { Logger } from '../logger';
import { BrowserInitialStateOption, BrowserResource } from '../browser';
import { FoxpageHooks } from '../hook';
import { RequestMode } from '../request';
import { StructureNode } from '../structure';
import { AppConfig } from '../application';

type ContentType = Template | Variable | Condition | FPFunction;

export interface FrameworkResource extends BrowserResource {}
export interface RenderOption extends BrowserInitialStateOption {}

export interface ParsedContent<T = ContentType, P = any> {
  content: T;
  parseStatus?: boolean;
  parseMessages?: string[];
  parsed: P;
}

export interface RenderContent<T = ContentType> extends ParsedContent<T> {
  renderMessage?: string[];
}

export interface ContextResource {
  templates?: Record<string, RenderContent<Template>>;
  variables?: Record<string, RenderContent<Variable>>;
  conditions?: Record<string, RenderContent<Condition>>;
  functions?: Record<string, RenderContent<FPFunction>>;
}

export interface ContextOrigin {
  page?: Page;
  templates?: Template[];
  packages?: Package[];
  variables?: Variable[];
  sysVariables?: Variable[];
  conditions?: Condition[];
  functions?: FPFunction[];
}

/**
 * render context
 *
 * @export
 * @interface Context
 */
export interface Context {
  URL?: url.URL;
  url: string;
  host: string;

  // app base
  readonly appId: string;
  readonly appSlug: string;
  readonly appConfigs?: AppConfig;

  page: Page;
  tags?: Tag[];
  packages?: Package[];
  /**
   * key - string - structure id
   * value - FoxpageComponent - component
   */
  componentMap?: Map<string, FoxpageComponent>;
  /**
   * key - string - structure id
   * value - FoxpageComponent - component
   */
  dependencies?: Map<string, FoxpageComponent>;

  structureMap?: Map<
    string,
    Pick<StructureNode, 'id' | 'name' | 'version' | 'type' | 'props'> & { childrenIds: string[] }
  >;

  // getters
  templates: Record<string, Template>;
  variables: Record<'__templates' | '__conditions' | '__functions' | string, unknown>;
  conditions: Record<string, boolean>;
  functions: Record<string, unknown>;

  plugins?: string[];
  hooks?: FoxpageHooks;

  runtime?: {
    isServer?: boolean;
    isBrowser?: boolean;
    clientType?: 'server' | 'browser';
  };

  // origin source: immutable
  readonly origin: ContextOrigin;

  frameworkResource?: FrameworkResource;
  options?: RenderOption;

  logger?: Logger;
  // performance

  updateOrigin(relation: RelationInfo): void;
  updateOriginPage(page: Page): void;
  getOrigin<K extends keyof ContextOrigin>(key: K): ContextOrigin[K];
  updatePage(page: Page): void;
  updateResource<K extends keyof ContextResource, T extends RenderContent>(target: K, key: string, value: T): void;

  render?: (dsl: Page['schemas'], ctx: Context) => Promise<string>;
}
