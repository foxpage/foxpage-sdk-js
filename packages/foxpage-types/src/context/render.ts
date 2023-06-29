import * as url from 'url';

import { AppConfig, FoxRoute } from '../application';
import { BrowserInitialStateOption, BrowserResource } from '../browser';
import { FoxpageComponent } from '../component';
import { ContentDetail } from '../content';
import { FoxpageHooks } from '../hook';
import { Logger } from '../logger';
import {
  Block,
  Condition,
  FPFile,
  FPFunction,
  Mock,
  Package,
  Page,
  RelationInfo,
  Tag,
  Template,
  Variable,
} from '../manager';
import { PerformanceLogger, RenderPerformance } from '../performance';
import { FoxpageDelegatedCookie, FoxpageDelegatedRequest, FoxpageDelegatedResponse, RequestMode } from '../request';
import { StructureNode } from '../structure';

type ContentType = Template | Variable | Condition | FPFunction | Block;

export interface FrameworkResource extends BrowserResource {}
export interface RenderOption extends BrowserInitialStateOption {}
export type ContextPage = ContentDetail<StructureNode>; // page or block

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
  blocks?: Record<string, RenderContent<Block>>;
}

export interface ContextOrigin {
  /**
   * T：contain page,block content
   */
  page?: ContextPage;
  extendPage?: Page;
  templates?: Template[];
  packages?: Package[];
  variables?: Variable[];
  sysVariables?: Variable[];
  conditions?: Condition[];
  functions?: FPFunction[];
  mocks?: Mock[];
  blocks?: Block[]; // deps
}

/**
 * render context
 *
 * @export
 * @interface Context
 */
export interface Context extends RequestMode {
  URL?: url.URL;
  url: string;
  host: string;
  locale?: string;

  _foxpage_preview_time?: string;

  // app base
  readonly appId: string;
  readonly appSlug: string;
  readonly appConfigs?: AppConfig;

  matchedRoute?: FoxRoute;
  pathname?: string;
  /**
   * T：contain page,block content
   */
  page: ContextPage;
  file?: FPFile;
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

  structureMap?: Map<string, StructureNode & { childrenIds: string[] }>;

  // getters
  templates: Record<string, Template>;
  variables: Record<'__templates' | '__conditions' | '__functions' | '__blocks', string | unknown>;
  conditions: Record<string, boolean>;
  functions: Record<string, unknown>;
  blocks: Record<string, Block>;

  plugins?: string[];
  hooks?: FoxpageHooks;

  runtime?: {
    isServer?: boolean;
    isBrowser?: boolean;
    clientType?: 'server' | 'browser';
  };

  // origin source: immutable
  readonly origin: ContextOrigin;

  // common configs
  frameworkResource?: FrameworkResource;
  options?: RenderOption;
  disableConditionRender?: boolean;

  // logger
  logger?: Logger;

  // performance
  performance: RenderPerformance;

  // request
  request?: FoxpageDelegatedRequest;
  response?: FoxpageDelegatedResponse;
  cookies?: FoxpageDelegatedCookie;

  updateOrigin(relation: RelationInfo): void;
  updateOriginByKey<K extends keyof ContextOrigin>(key: K, value: ContextOrigin[K]): void;
  updateOriginPage(content: ContextPage): void;
  getOrigin<K extends keyof ContextOrigin>(key: K): ContextOrigin[K];
  updatePage(content: ContextPage): void;
  updateResource<K extends keyof ContextResource, T extends RenderContent>(target: K, key: string, value: T): void;
  render?: (dsl: Page['schemas'], ctx: Context) => Promise<string>;
  performanceLogger: PerformanceLogger;
}
