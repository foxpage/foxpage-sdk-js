import {
  FileManager,
  TagManager,
  Template,
  Variable,
  Condition,
  FPFunction,
  PageManager,
  PackageManager,
  PluginManager,
  VariableManager,
  ConditionManager,
  TemplateManager,
  FunctionManager,
  Router,
  AppEvents,
  RelationInfo,
} from '../manager';
import { ContentDetail } from '../content';
import { TypedEventEmitter } from '../common'
import { AppConfig } from './config';
import { ResourceUpdateInfo } from '../ws';

export * from './config';

export interface ApplicationHooks {
  sourceUpdateHook?: (data: unknown) => void;
}

export interface AppScheduleDataType {
  appId?: string;
  contents: ResourceUpdateInfo;
  timestamp?: number;
}

export interface ApplicationOption {
  plugins?: string[];
  pluginDir?: string;
  hooks?: ApplicationHooks;
  configs?: AppConfig;
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
  readonly configs: AppConfig;

  enableSchedule(): boolean;
  onScheduled(): void;
  async refresh(updateInfos: AppScheduleDataType): void;
  async getContentRelationInfo(content: ContentDetail): Promise<RelationInfo>;
  destroy(): void;
}


export interface FPApplicationSetting {
}

export interface FPApplication {
  id: string;
  name: string;
  settings: ApplicationOption;
  slug: string;
  intro: string;
}
