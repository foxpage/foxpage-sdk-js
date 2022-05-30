import { ContentDetail } from '../content';
import { ApplicationOption, ApplicationHooks } from '../application'
import { FPEventEmitter } from '../common';
import { ManagerEvents } from './event';
import { Application } from '../application';
import { LOGGER_USE_LEVEL } from '../logger';
import { FoxpageHooks } from '..';

export interface ManagerBase<T> extends FPEventEmitter<ManagerEvents> {
  appId: string;

  exist(key: string): Promise<boolean>;
  destroy(): void;
}

/**
 * manager application meta data
 *
 * @export
 * @interface ManagerAppMeta
 */
export interface ManagerAppMeta extends ApplicationOption {
  /**
   * application id
   *
   * @type {string}
   */
  appId: string;
}

/**
 * dataService option
 * provider dataService config
 * @export
 * @interface DataServiceOption
 */
export interface DataServiceOption {
  /**
   * api host
   *
   * @type {string}
   */
  host: string;
  /**
   * api path
   *
   * @type {string}
   */
  path: string;
}

/**
 * manager option
 * provider manager config
 * @export
 * @interface ManagerOption
 */
export interface ManagerOption {
  /**
   * application list
   * metadata
   * @type {ManagerAppMeta[]}
   */
  apps: ManagerAppMeta[];
  /**
   * dataService option
   *
   * @type {DataServiceOption}
   */
  dataService: DataServiceOption;
  /**
   * common plugins
   *
   * @type {string[]}
   */
  plugins?: string[];
  /**
   * common plugin dir
   *
   * @type {string}
   */
  commonPluginDir?: string;
  /**
   *  settings
   */
  settings: {
    /**
   * is open source update
   *
   * @type {boolean}
   */
    openSourceUpdate?: boolean;
    sourceUpdateHook?: ApplicationHooks['sourceUpdateHook'];
  },
  /**
   * process info
   *
   * @type {{
   *     isMaster?: boolean;
   *     procId?: number;
   *   }}
   */
  procInfo?: {
    isMaster?: boolean;
    procId?: number;
  },
  /**
   * logger config
   *
   * @type {{
   *     level?: LOGGER_USE_LEVEL
   *   }}
   */
  loggerConfig?: {
    level?: LOGGER_USE_LEVEL
  }
}

export interface Manager {
  hooks: FoxpageHooks | undefined;
  prepare(): Promise<void>;
  registerApplications(appMates: ManagerOption['apps']): void;
  unRegisterApplications(appIds: string[]);
  removeApplications(appIds: string[]): void;
  existApplication(appId: string): boolean;
  existApplicationBySlug(appName: string): boolean
  getApplication(appId: string): Application | undefined;
  getApplicationBySlug(name: string): Application | undefined;
  getApplications(appIds?: string[]): Application[];
  clear(): void;
}


export interface ManagerSource extends ContentDetail {

}
