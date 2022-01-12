import { Mode } from '@foxpage/foxpage-plugin';
import { Messages } from '@foxpage/foxpage-shared';
import {
  Application,
  ApplicationOption,
  FPApplication,
  Logger,
  Manager,
  ManagerAppMeta,
  ManagerOption,
} from '@foxpage/foxpage-types';

import { PluginManager } from './../../foxpage-types/manager/plugin/index.d';
import { createFoxpageDataService, foxpageDataService } from './data-service/service';
import { getApis } from './api';
import { ApplicationImpl } from './application';
import { createLogger, initLogger } from './common';
import { PluginManagerImpl } from './plugin';

/**
 * manager
 *
 * @export
 * @class Manager
 */
export class ManagerImpl implements Manager {
  /**
   * managed application
   *
   * @type {Map<string, Application>}
   */
  private applicationMap: Map<string, Application> = new Map<string, Application>();
  /**
   * application slug map
   * for get app by name fast
   * @private
   * @type {Map<string, string>}
   */
  private applicationSlugMap: Map<string, string> = new Map<string, string>();
  /**
   * message
   *
   * @type {Messages}
   */
  messages: Messages;
  /**
   * logger
   *
   * @type {Logger}
   */
  public logger?: Logger;

  public settings: ManagerOption['settings'];

  public options?: ManagerOption;

  private pluginDir: ManagerOption['commonPluginDir'];

  private pluginManager: PluginManager;

  constructor(opt: ManagerOption) {
    this.pluginDir = opt.commonPluginDir || process.cwd();
    this.pluginManager = new PluginManagerImpl({
      plugins: opt.plugins,
      baseDir: this.pluginDir,
      api: getApis(),
      mode: Mode.DISTRIBUTION,
    });

    this.options = opt;
    this.settings = opt.settings;
    this.messages = new Messages();
  }

  get hooks() {
    return this.pluginManager.getHooks();
  }

  /**
   * prepare
   * load plugins
   *
   * @memberof ManagerImpl
   */
  public async prepare() {
    this.pluginManager.loadPlugins();
    // init logger: for bind logger hook
    await initLogger(this.hooks);
    // create foxpage data service
    if (this.options) {
      createFoxpageDataService(this.options.dataService);
    }

    this.logger = createLogger('Manager', this.options);
  }

  /**
   * new applications
   *
   * @param {ManagerOption['apps']} appMates
   */
  public async registerApplications(appMates: ManagerOption['apps']) {
    const appIds = Array.from(new Set(appMates.map(item => item.appId)));
    this.logger?.info('will register apps:', appIds);

    try {
      const apps = await foxpageDataService.fetchAppDetails(appIds);
      this.logger?.debug('get apps:', JSON.stringify(apps));

      const appMateMap = new Map<string, ManagerAppMeta>();
      appMates.forEach(item => {
        appMateMap.set(item.appId, item);
      });

      const batch = apps.map(async app => await this.registerApplication(app, appMateMap.get(app.id)));
      const result = await (await Promise.all(batch)).filter(item => !item);
      if (result.length > 0) {
        throw new Error('init applications failed');
      }

      // succeed
      this.logger?.info('init applications succeed');
    } catch (e) {
      const msg = (e as Error).message;
      this.logger?.error(msg);
      throw new Error(msg);
    }
  }

  /**
   * un register apps
   *
   * @param {string[]} appIds
   */
  public unRegisterApplications(appIds: string[]) {
    appIds.forEach(appId => {
      const app = this.getApplication(appId);
      if (app) {
        app.destroy();
        this.applicationMap.delete(appId);
        this.applicationSlugMap.delete(app?.slug);
      }
    });
  }

  /**
   * remove applications from manager
   *
   * @param {string[]} [appIds=[]]
   */
  public removeApplications(appIds: string[] = []) {
    const apps = this.getApplications(appIds);
    apps.forEach(app => {
      app.destroy();
      this.applicationMap.delete(app.appId);
    });
  }

  /**
   * if exist application
   *
   * @param {string} appId
   * @return {*} {boolean}
   */
  public existApplication(appId: string): boolean {
    return this.applicationMap.has(appId);
  }

  /**
   * if exist application via app slug
   *
   * @param {string} slug
   * @return {*} {boolean}
   */
  /** */
  public existApplicationBySlug(slug: string): boolean {
    return this.applicationSlugMap.has(slug);
  }

  /**
   * find application via appId
   *
   * @param {string} appId
   * @return {(Application | undefined)}
   */
  public getApplication(appId: string): Application | undefined {
    return this.applicationMap.get(appId);
  }

  /**
   * get application via app slug
   *
   * @param {string} slug
   * @return {*}  {(Application | undefined)}
   */
  public getApplicationBySlug(slug: string): Application | undefined {
    const appId = this.applicationSlugMap.get(slug);
    if (!appId) {
      return undefined;
    }
    return this.applicationMap.get(appId);
  }

  /**
   * find application list
   *
   * @param {string[]} [appIds=[]]
   * @return  {Application[]}
   */
  public getApplications(appIds?: string[]): Application[] {
    if (!appIds) {
      return Array.from(this.applicationMap.values());
    }
    return appIds.map(appId => this.getApplication(appId)).filter(Boolean) as Application[];
  }

  /**
   * clear all data
   */
  public clear() {
    this.unRegisterApplications(Array.from(this.applicationSlugMap.values()));
    this.messages = new Messages();
  }

  private async registerApplication(app: FPApplication, metaData?: ManagerAppMeta) {
    const { id: appId } = app;
    if (!this.existApplication(app.id) && !this.existApplicationBySlug(app.slug)) {
      const { plugins, hooks } = metaData || {};
      const appInstance = new ApplicationImpl(
        app,
        this.generateAppConfig(app, { plugins, pluginDir: this.pluginDir, hooks }),
      );

      this.applicationMap.set(appId, appInstance);
      this.applicationSlugMap.set(appInstance.slug, appInstance.appId);

      try {
        // application prepare
        await appInstance.prepare();

        this.logger?.info(`application@${appId} init succeed`);
        return true;
      } catch (e) {
        appInstance.destroy();
        this.applicationMap.delete(appId);
        this.applicationSlugMap.delete(appInstance.slug);

        this.logger?.warn(`application@${appId} init failed`, e);
        return false;
      }
    } else {
      const msg = `application@${appId} init failed: exist this appId or slug`;
      this.messages.push(msg);
      this.logger?.error(msg);
      return false;
    }
  }

  private initAppSourceScheduleStatus(enable?: boolean) {
    return (enable === undefined || enable) && this.settings.openSourceUpdate;
  }

  private generateAppConfig(app: FPApplication, options: ApplicationOption | undefined) {
    // merge online settings & local settings
    const appSettings = Object.assign({}, options, app.settings);
    if (!appSettings.configs) {
      appSettings.configs = {};
    }
    appSettings.configs['schedule.enable'] = this.initAppSourceScheduleStatus(appSettings.configs?.['schedule.enable']);

    // TODO: need provider hook logic
    if (!appSettings.hooks) {
      appSettings.hooks = {};
    }
    appSettings.hooks.sourceUpdateHook = this.settings.sourceUpdateHook;

    return appSettings;
  }
}
