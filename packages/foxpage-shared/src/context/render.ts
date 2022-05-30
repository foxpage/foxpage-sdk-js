import _ from 'lodash';

import {
  AppConfig,
  Context,
  ContextOrigin,
  ContextResource,
  Page,
  RelationInfo,
  RenderAppInfo,
  RenderContent,
  Template,
} from '@foxpage/foxpage-types';

import { ContentType } from '../content';
import { createSysVariable } from '../variable';

import { CONTEXT_VARIABLE_MARK } from './constant';
import { contentProxy } from './proxy';

/**
 * Foxpage abstract context
 *
 * @export
 * @abstract
 * @class ContextInstance
 * @implements {Context}
 */
export abstract class ContextInstance implements Context {
  // app base info
  readonly appId: string;
  readonly appSlug: string;
  readonly appConfigs?: AppConfig;

  private innerPage?: Page;

  url = '';
  host = '';

  /**
   * parsed resources
   *
   * @type {ContextResource}
   */
  private resource: ContextResource = {};

  /**
   * origin resources
   * immutable
   * @type {ContextOrigin}
   */
  readonly origin: ContextOrigin = {};

  constructor(info: RenderAppInfo) {
    this.appId = info.appId;
    this.appSlug = info.slug;
    this.appConfigs = info.configs;
  }

  /**
   * update relation info
   * @param relationInfo relation info
   */
  public updateOrigin<K extends keyof Pick<ContextOrigin, 'templates' | 'functions' | 'conditions' | 'mocks'>>(
    relationInfo: RelationInfo,
  ) {
    const { sysVariables = [], variables = [], ...rest } = relationInfo;
    // 'templates' | 'functions' | 'conditions' | 'mocks'
    Object.keys(rest).forEach(key => {
      const type = key as K;
      this.updateOriginByKey(type, rest[type]);
    });
    this.updateOriginByKey(
      'sysVariables',
      sysVariables.map(item => createSysVariable(item)),
    );
    this.updateOriginByKey('variables', (this.origin.sysVariables || []).concat(variables));
  }

  /**
   * update origin data
   * @param key key type
   * @param value data
   */
  public updateOriginByKey<K extends keyof ContextOrigin>(key: K, value: ContextOrigin[K]): void {
    if (value !== undefined) {
      this.origin[key] = value;
    }
  }

  /**
   * update origin page
   *
   * @param {Page} page
   */
  public updateOriginPage(page: Page) {
    this.updateOriginByKey('page', page);
  }

  /**
   * get origin
   *
   * @template K
   * @param {K} key
   * @return {*}  {RenderContextOrigin[K]}
   */
  public getOrigin<K extends keyof ContextOrigin>(key: K): ContextOrigin[K] {
    const result = this.origin[key];
    if (result) {
      return _.cloneDeep(result);
    }
    return;
  }

  /**
   * update page info
   *
   * @param {Page} page
   */
  public updatePage(page: Page) {
    this.innerPage = page;
  }

  /**
   * update ctx resources
   *
   * @template K
   * @template T
   * @param {K} target
   * @param {string} key
   * @param {T} value
   */
  public updateResource<K extends keyof ContextResource, T extends RenderContent>(target: K, key: string, value: T) {
    const targetSource = this.resource[target];
    if (!targetSource) {
      this.resource[target] = {
        [key]: value,
      } as ContextResource[K];
    } else {
      targetSource[key] = value as RenderContent<any>;
    }
  }

  public get page() {
    return this.innerPage || ({} as Page);
  }

  public get templates() {
    return this.getValues<ContextResource[ContentType.TEMPLATE], Template>(this.resource.templates);
  }

  public get conditions() {
    return this.getValues<ContextResource[ContentType.CONDITION], boolean>(this.resource.conditions);
  }

  public get functions() {
    return this.getValues<ContextResource[ContentType.FUNCTION], unknown>(this.resource.functions);
  }

  public get variables() {
    const allVars = this.getValues<ContextResource[ContentType.VARIABLE], unknown>(this.resource.variables);
    const [sysVariables, cusVariables] = this.filterVariables(allVars);
    // all variables
    const variables: Record<string, unknown> = cusVariables;
    variables['__functions'] = contentProxy(this.functions);
    variables['__conditions'] = contentProxy(this.conditions);
    variables['__templates'] = contentProxy(this.templates);
    variables['__context'] = contentProxy({
      ...sysVariables,
    });

    return variables;
  }

  private getValues<T, K>(contents: T) {
    if (!contents) {
      return {};
    }

    const values: Record<string, K> = {};
    Object.keys(contents).forEach(key => {
      const keyStr = key as keyof T;
      const { parsed } = contents[keyStr] as unknown as RenderContent;
      values[key] = parsed;
    });

    return values;
  }

  private filterVariables(list: Record<string, unknown>) {
    const sysVars: typeof list = {};
    const cusVars: typeof list = {};
    Object.keys(list).forEach(key => {
      if (key.indexOf(CONTEXT_VARIABLE_MARK) === 0) {
        const sysKey = key.replace(CONTEXT_VARIABLE_MARK, '');
        sysVars[sysKey] = list[key];
      } else {
        cusVars[key] = list[key];
      }
    });
    return [sysVars, cusVars];
  }
}
