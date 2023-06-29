import { TypedEventEmitter } from '../common';
import { ContentDetail } from '../content';
import {
  AppEvents,
  BlockManager,
  ConditionManager,
  FileManager,
  FunctionManager,
  MockManager,
  PackageManager,
  PageManager,
  PluginManager,
  RelationInfo,
  Router,
  SecurityManager,
  TagManager,
  TemplateManager,
  VariableManager,
} from '../manager';
import { ResourceUpdateInfo } from '../ws';

import { AppConfig } from './config';

export * from './config';
export * from './route';
export * from './security';

export interface ApplicationHooks {
  sourceUpdateHook?: (data: unknown) => void;
}

export interface AppScheduleDataType {
  appId?: string;
  contents: ResourceUpdateInfo;
  timestamp?: number;
}

export interface ApplicationResourceItem {
  name: string;
  host?: string;
  downloadHost?: string;
}

export interface ApplicationOption {
  plugins?: string[];
  pluginDir?: string;
  hooks?: ApplicationHooks;
  /**
   * from  foxpage.config.js
   */
  configs?: AppConfig;
  /**
   * application resource
   */
  resources?: ApplicationResourceItem[];
}

export interface UserRequest {
  /**
   * pageId
   *
   * @type {string}
   */
  pageId: string;
}
export interface Application extends TypedEventEmitter<AppEvents> {
  readonly appId: string;
  readonly slug: string;

  readonly fileManager: FileManager;
  readonly tagManager: TagManager;
  readonly pageManager: PageManager;
  readonly packageManager: PackageManager;
  readonly pluginManager: PluginManager;
  readonly variableManager: VariableManager;
  readonly conditionManager: ConditionManager;
  readonly templateManager: TemplateManager;
  readonly functionManager: FunctionManager;
  readonly routeManager: Router;
  readonly mockManager: MockManager;
  readonly blockManager: BlockManager;
  readonly securityManager: SecurityManager;
  configs: AppConfig;
  hooks: ApplicationOption['hooks'];
  resources?: ApplicationOption['resources'];

  enableSchedule(): boolean;
  onScheduled(): void;
  refresh(updateInfos: AppScheduleDataType): void;
  getContentRelationInfo(content: ContentDetail): Promise<RelationInfo>;
  destroy(): void;
}

export interface FPApplicationSetting {}

export interface FPApplication {
  id: string;
  name: string;
  settings: ApplicationOption;
  slug: string;
  intro: string;
}
