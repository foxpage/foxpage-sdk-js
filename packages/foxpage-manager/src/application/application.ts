import _ from 'lodash';

import { Mode } from '@foxpage/foxpage-plugin';
import { ContentType } from '@foxpage/foxpage-shared';
import {
  AppConfig,
  AppEvents,
  Application,
  ApplicationOption,
  AppScheduleDataType,
  BlockManager,
  ConditionManager,
  ContentDetail,
  ContentInfo,
  FileManager,
  FPApplication,
  FunctionManager,
  Logger,
  MockManager,
  PackageManager,
  PageManager,
  PluginManager,
  RelationInfo,
  Route,
  Router,
  SecurityManager,
  TagManager,
  TemplateManager,
  VariableManager,
} from '@foxpage/foxpage-types';

import { BlockManagerImpl } from '../block';
import { createLogger, FPEventEmitterInstance } from '../common';
import { ConditionManagerImpl } from '../condition';
import { foxpageDataService } from '../data-service';
import { FileManagerImpl } from '../file';
import { FunctionManagerImpl } from '../function';
import { MockManagerImpl } from '../mock';
import { PackageManagerImpl } from '../package';
import { PageManagerImpl } from '../page';
import { PluginManagerImpl } from '../plugin';
import { RouterImpl } from '../router';
import { SecurityManagerImpl } from '../security';
import { TagManagerImpl } from '../tag';
import { TemplateManagerImpl } from '../template';
import { VariableManagerImpl } from '../variable';

import { initAppConfig } from './config';
import { Schedule, ScheduleOptions } from './schedule';

type CollectionType = Pick<
  ContentDetail,
  ContentType.FUNCTION | ContentType.TEMPLATE | ContentType.VARIABLE | ContentType.CONDITION | ContentType.BLOCK
>;

function createSourceUpdateSchedule(app: ApplicationImpl) {
  const options: ScheduleOptions = {
    appId: app.appId,
    interval: app.configs['schedule.interval'] || 40 * 1000,
  };
  const updateTask = async (preData?: AppScheduleDataType) => {
    const preTimestamp = preData?.timestamp || -1; // -1 will return all
    try {
      let result: AppScheduleDataType = await foxpageDataService.fetchChanges(app.appId, preTimestamp);
      if (!result) {
        result = {
          contents: {},
          timestamp: preTimestamp,
        };
      }
      result.appId = app.appId;
      return result;
    } catch (e) {
      app.logger?.error((e as Error).message);
      return {
        appId: app.appId,
        contents: {},
        timestamp: preTimestamp,
      };
    }
  };
  const schedule = new Schedule(updateTask, options);
  return schedule;
}

/**
 * application
 * same to appContext that contains all resource(content,plugins,hooks...) of this application
 * @export
 * @class ApplicationImpl
 * @extends {AppEventsImpl}
 * @implements {Application}
 */
export class ApplicationImpl extends FPEventEmitterInstance<AppEvents> implements Application {
  /**
   * application id
   *
   * @type {string}
   */
  public readonly appId: string;
  /**
   * application slug
   *
   * @type {string}
   */
  public readonly slug: string;
  /**
   * foxpage application info
   *
   * @type {FPApplication}
   */
  public readonly app: FPApplication;
  /**
   * file manager
   *
   * @type {FileManager}
   */
  public readonly fileManager: FileManager;
  /**
   * tag resource manager
   *
   * @type {TagManager}
   */
  public readonly tagManager: TagManager;
  /**
   * page resource manager
   *
   * @type {PageManager}
   */
  public readonly pageManager: PageManager;
  /**
   * package resource manager
   *
   * @type {PackageManager}
   */
  public readonly packageManager: PackageManager;
  /**
   * variable manager
   *
   * @type {VariableManager}
   */
  public readonly variableManager: VariableManager;
  /**
   * condition manager
   *
   * @type {ConditionManager}
   */
  public readonly conditionManager: ConditionManager;
  /**
   * template resource manager
   *
   * @type {TemplateManager}
   */
  public readonly templateManager: TemplateManager;
  /**
   * function manager
   *
   * @type {FunctionManager}
   */
  public readonly functionManager: FunctionManager;
  /**
   * plugin manager
   *
   * @type {PluginManager}
   */
  public readonly pluginManager: PluginManager;
  /**
   * mock manager
   *
   * @type {MockManager}
   */
  public readonly mockManager: MockManager;
  /**
   * block manager
   *
   * @type {BlockManager}
   */
  public readonly blockManager: BlockManager;
  /**
   * router
   *
   * @type {Router}
   */
  public readonly routeManager: Router;
  /**
   * ticket checker
   */
  public readonly securityManager: SecurityManager;
  /**
   * logger
   *
   * @type {Logger}
   */
  public readonly logger: Logger;
  /**
   * source update schedule
   *
   * @type {Schedule<AppScheduleDataType>}
   */
  public readonly schedule?: Schedule<AppScheduleDataType>;
  /**
   * application configs
   *
   * @type {AppConfig}
   */
  public readonly configs: AppConfig;

  public readonly hooks: ApplicationOption['hooks'];

  public readonly resources?: ApplicationOption['resources'];

  constructor(app: FPApplication, opt: ApplicationOption) {
    super();
    this.appId = app.id;
    this.slug = app.slug;
    this.app = app;
    // init configs
    this.configs = initAppConfig(opt.configs);
    this.hooks = opt.hooks;
    this.resources = opt.resources;

    // init source managers
    this.fileManager = new FileManagerImpl(this);
    this.pageManager = new PageManagerImpl(this);
    this.packageManager = new PackageManagerImpl(this);
    this.variableManager = new VariableManagerImpl(this);
    this.conditionManager = new ConditionManagerImpl(this);
    this.templateManager = new TemplateManagerImpl(this);
    this.functionManager = new FunctionManagerImpl(this);
    this.tagManager = new TagManagerImpl(this);
    this.pluginManager = new PluginManagerImpl({
      plugins: opt.plugins,
      baseDir: opt.pluginDir || '',
      api: {},
    });
    this.mockManager = new MockManagerImpl(this);
    this.routeManager = new RouterImpl(this);
    this.blockManager = new BlockManagerImpl(this);
    this.securityManager = new SecurityManagerImpl(this);

    //logger
    this.logger = createLogger('Application');
    // listen push
    this.initEvents();

    if (this.enableSchedule()) {
      // instance resource update schedule
      this.schedule = createSourceUpdateSchedule(this);
      // listen schedule error
      this.schedule?.on('ERROR', error => {
        this.logger.warn('schedule error:', error);
      });
    }
  }

  /**
   * application prepare
   * fresh templates and packages
   */
  public async prepare() {
    await this.packageManager.freshPackages({ strategy: this.configs.package?.loadStrategy || 'all' });
    this.pluginManager.loadPlugins();

    const hooks = this.pluginManager.getHooks(Mode.DISTRIBUTION);
    const { registerRouter } = hooks || {};
    if (typeof registerRouter === 'function') {
      const routes = (await registerRouter()) as unknown as Route[];
      if (Array.isArray(routes)) {
        this.routeManager.register(routes);
      } else {
        this.routeManager.register([routes]);
      }
    }

    // schedule
    if (this.enableSchedule()) {
      this.logger.info('start process schedule');
      this.onScheduled();
      this.schedule?.start();
    }
  }

  /**
   * listen schedule
   *
   */
  public onScheduled() {
    const listener = (value: AppScheduleDataType) => {
      this.logger.info('receive data:', JSON.stringify(value));
      if (value) {
        if (typeof this.hooks?.sourceUpdateHook === 'function') {
          this.hooks.sourceUpdateHook(value);
        }
        this.refresh(value);
      }
    };
    this.schedule?.on('DATA_RECEIVE', listener);
  }

  /**
   * get schedule status
   *
   * @return {boolean}
   */
  public enableSchedule() {
    return !!this.configs['schedule.enable'];
  }

  /**
   * refresh data
   *
   * @param {ResourceUpdateInfo} updateInfos
   */
  public async refresh(updateInfos: AppScheduleDataType) {
    if (updateInfos.appId === this.appId) {
      this.logger.info('refresh source');
      this.emit('DATA_PULL', updateInfos.contents);
    }
  }

  /**
   * get content relation data
   * contain the deps of variable,condition,functions
   * @template T
   * @param {ContentDetail<T>} content
   * @return {*}  {(Promise<RelationInfo | null>)}
   */
  public async getContentRelationInfo(content: ContentDetail): Promise<RelationInfo> {
    const relations: RelationInfo = {
      templates: [],
      variables: [],
      sysVariables: [],
      conditions: [],
      functions: [],
      blocks: [],
    };

    return await this.getRelations(content, relations);
  }

  private async getRelations<T extends Partial<ContentDetail> | CollectionType>(
    content: T,
    relations: RelationInfo,
  ): Promise<RelationInfo> {
    this.ComposeSysVariable(content, relations);
    const getter = this.relationGetter(content, relations);

    const result = await Promise.all([
      await getter(ContentType.TEMPLATE, async value => this.templateManager.getTemplates(value)),
      await getter(ContentType.VARIABLE, async value => this.variableManager.getVariables(value)),
      await getter(ContentType.CONDITION, async value => this.conditionManager.getConditions(value)),
      await getter(ContentType.FUNCTION, async value => this.functionManager.getFunctions(value)),
      await getter(ContentType.BLOCK, async value => this.blockManager.getBlocks(value)),
    ]);

    const collections = {} as T;
    result.forEach(item => {
      item?.forEach((cont: ContentDetail) => {
        const filter = this.relationFilter(cont, relations, collections as CollectionType);
        filter(ContentType.TEMPLATE);
        filter(ContentType.VARIABLE);
        filter(ContentType.CONDITION);
        filter(ContentType.FUNCTION);
        filter(ContentType.BLOCK);
      });
    });

    if (
      collections.templates?.length ||
      collections.variables?.length ||
      collections.conditions?.length ||
      collections.functions?.length ||
      collections.blocks?.length
    ) {
      await this.getRelations(collections, relations);
    }

    return relations;
  }

  private ComposeSysVariable<T extends Partial<ContentDetail>>(content: T, relations: RelationInfo) {
    const list = relations[ContentType.SYS_VARIABLE] || [];
    const relationList = content[ContentType.SYS_VARIABLE];
    if (!relationList || relationList.length === 0) {
      return;
    }
    relations[ContentType.SYS_VARIABLE] = _.union(list, relationList);
  }

  private relationGetter<T extends Partial<ContentDetail>>(content: T, relations: RelationInfo) {
    return async <K extends keyof Omit<RelationInfo, 'sysVariables' | 'extendPage'>>(
      key: K,
      getter: (_filtered: string[]) => Promise<RelationInfo[K]>,
    ): Promise<RelationInfo[K] | []> => {
      const relationList = relations[key] as unknown as T[];
      const list = content[key]; // dep source id array
      if (!list || list.length === 0) {
        return [];
      }

      const filtered = list.filter(item => !this.checkRelationIn(relationList, item));
      if (filtered.length === 0) {
        return [];
      }

      const result = ((await getter(filtered)) || []) as RelationInfo[K];
      result?.forEach((item: ContentDetail) => {
        this.ComposeSysVariable(item, relations);

        if (!this.checkRelationIn(relationList, item.id)) {
          relationList.push(item as unknown as T);
        }
      });

      return result;
    };
  }

  private relationFilter<T extends Partial<ContentDetail> | CollectionType>(
    content: T,
    relations: RelationInfo,
    collections: T,
  ) {
    return <K extends keyof RelationInfo>(key: K): unknown[] | undefined => {
      const keyStr = key as keyof CollectionType;
      const relationList = relations[keyStr] as unknown as T[];
      const list = content[keyStr]; // dep source id array
      if (!list || list.length === 0) {
        return [];
      }
      if (!collections[keyStr]) {
        collections[keyStr] = [];
      }
      list.forEach(item => {
        if (!this.checkRelationIn(relationList, item) && collections[keyStr]?.indexOf(item) === -1) {
          collections[keyStr]?.push(item);
        }
      });
    };
  }

  private checkRelationIn<T extends Partial<ContentDetail>>(list: T[], value: string) {
    return list.findIndex(cont => cont.id === value) > -1;
  }

  private initEvents() {
    this.tagManager.on('DATA_PUSH', (data: ContentInfo) => {
      this.emit('DATA_STASH', data);
    });
    this.pageManager.on('DATA_PUSH', (data: ContentInfo) => {
      this.emit('DATA_STASH', data);
    });
  }

  /**
   * destroy
   */
  public destroy() {
    this.fileManager.destroy();
    this.blockManager.destroy();
    this.conditionManager.destroy();
    this.functionManager.destroy();
    this.packageManager.destroy();
    this.pageManager.destroy();
    this.tagManager.destroy();
    this.templateManager.destroy();
    this.variableManager.destroy();
    this.pluginManager.destroy();
    this.mockManager.destroy();
    this.routeManager.destroy();
    this.schedule?.stop();
  }
}
