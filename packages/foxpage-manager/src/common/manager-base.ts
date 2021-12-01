import _ from 'lodash';

import { isNotNill, Logger } from '@foxpage/foxpage-shared';
import {
  Application,
  ContentInfo,
  ManagerBase,
  ManagerEvents,
  ResourceCache,
  ResourceUpdateInfo,
} from '@foxpage/foxpage-types';

import { createDiskCache, createLRUCache } from '../cache';
import { createLogger } from '../common';

import { FPEventEmitterInstance } from './event';

export type ManagerBaseOptions = {
  /**
   * types: package,page,template,variable,...
   *
   * @type {string}
   */
  type: string;
  /**
   * disk cache config
   *
   * @type {{
   *     enable: boolean;
   *     path: string;
   *   }}
   */
  diskCache?: {
    enable: boolean;
    // path: string;
  };
  /**
   * lru cache config
   *
   * @type {{
   *     size: number;
   *   }}
   */
  lruCache?: {
    size: number;
  };
};

/**
 * manager base
 *
 * @export
 * @abstract
 * @class ManagerBase
 */
export abstract class ManagerBaseImpl<T> extends FPEventEmitterInstance<ManagerEvents> implements ManagerBase<T> {
  /**
   * application id
   *
   * @type {string}
   */
  readonly appId: string;
  /**
   * hot resources
   *
   * @type {ResourceCache}
   */
  private hotResources: ResourceCache<T>;
  /**
   * cold resources
   *
   * @private
   * @type {ResourceCache}
   */
  private diskResources?: ResourceCache<T>;
  /**
   * need update source keys
   * for record the no update source key, call the thread to refresh next request
   * @private
   * @type {string[]}
   */
  private needUpdates: string[] = [];
  /**
   * logger
   *
   * @protected
   * @type {Logger}
   */
  protected logger: Logger;

  constructor(app: Application, opt?: ManagerBaseOptions) {
    super();
    this.appId = app.appId;
    this.logger = createLogger(`App@${app.appId} ${opt?.type}Manager`);
    // DATA_PULL
    app.on('DATA_PULL', async (data: ResourceUpdateInfo) => {
      try {
        await this.onPull(data || {});
      } catch (e) {
        this.logger.error('DATA_PULL error:', e);
      }
    });
    // DATA_STASH
    app.on('DATA_STASH', (data: ContentInfo) => {
      try {
        this.onStash(data);
      } catch (e) {
        this.logger.error('DATA_STASH error:', e);
      }
    });
    // cache
    this.hotResources = createLRUCache(opt?.lruCache?.size);
    if (opt?.diskCache?.enable) {
      this.diskResources = createDiskCache({ appId: this.appId, type: `${opt?.type || 'default'}s` });
    }
  }

  /**
   * DATA_PULL listener
   *
   * @protected
   * @param {ResourceUpdateInfo} _data
   */
  protected async onPull(_data: ResourceUpdateInfo) {}

  /**
   * DATA_STASH listener
   *
   * @protected
   * @param {ContentInfo} _data
   */
  protected onStash(_data: ContentInfo) {}

  /**
   * create source instance
   *
   * @protected
   * @param {T} _data
   */
  protected abstract createInstance(_data: T | any): Promise<T>;

  /**
   * fetch source from server func
   *
   * @protected
   * @abstract
   * @param {string[]} outs
   * @return {*}  {(Promise<T[] | undefined>)}
   */
  protected abstract onFetch(outs: string[]): Promise<T[] | undefined>;

  /**
   * add source
   *
   * @protected
   * @param {string} key
   * @param {T} content
   * @param {T} instance
   */
  protected addOne<K extends T | any>(key: string, content: K, instance: T) {
    // cache content instance to memory
    this.hotResources.set(key, instance);
    // cache origin content to disk
    this.diskResources?.set(key, content as any);
    // remove no updates
    this.removeNeedUpdates([key]);
  }

  /**
   * find source from local
   * find from hot cache,
   * if not exist will find from disk
   * @protected
   * @param {string} key
   * @return {*}
   */
  protected async findOneFromLocal(key: string) {
    let resource = this.hotResources.get(key);
    if (!resource) {
      resource = await this.diskResources?.get(key);

      // will set to hot
      if (resource) {
        const resourceInstance = await this.createInstance(resource);
        this.hotResources.set(key, resourceInstance);
        return resourceInstance;
      }
    }

    return resource;
  }

  /**
   * [batch] find all sources from local via source keys
   *
   * @protected
   * @param {string[]} keys
   * @return {*}
   */
  protected async findFromLocal(keys: string[]) {
    return (
      await Promise.all(
        keys.map(async key => {
          const local = await this.findOneFromLocal(key);

          if (!local) {
            this.logger.warn(`not exist the "${key}" content`);
            return null;
          }

          return local;
        }),
      )
    ).filter(isNotNill);
  }

  /**
   * remove source
   *
   * @protected
   * @param {string} key
   */
  protected removeOne(key: string) {
    this.hotResources.delete(key);
  }

  /**
   * [batch] remove all sources from via source keys
   *
   * @protected
   * @param {string[]} keys
   * @memberof ManagerBaseImpl
   */
  protected remove(keys: string[]) {
    keys.forEach(key => {
      this.removeOne(key);
    });
  }

  /**
   * check if has the source
   *
   * @protected
   * @param {string} key
   * @return {*}
   */
  protected async has(key: string) {
    return this.hotResources.has(key) || (await this.diskResources?.has(key));
  }

  /**
   * add no updates
   *
   * @param {string[]} keys
   * @protected
   */
  protected markNeedUpdates(keys: string[] = []) {
    keys.forEach(key => {
      if (!this.existInNeedUpdates(key)) {
        this.needUpdates.push(key);
      }
    });
  }

  /**
   * remove the no updates
   *
   * @param {string[]} keys
   * @protected
   */
  protected removeNeedUpdates(keys: string[] = []) {
    const result = _.remove(this.needUpdates, item => keys.indexOf(item) > -1);
    this.needUpdates = result;
  }

  /**
   * if exist the no update source
   *
   * @protected
   * @param {string} key
   * @return {boolean}
   */
  protected existInNeedUpdates(key: string) {
    return this.needUpdates.indexOf(key) > -1;
  }

  /**
   * chunk
   * if exist local will add to ins, or add to outs
   *
   * @protected
   * @param {string[]} keys
   * @return {*}  {Promise<string[][]>} [ins, outs, invalids] ins(in local), outs(not in local), invalids(in local but is not valid)
   */
  protected async chunk(keys: string[]): Promise<string[][]> {
    const ins: string[] = [];
    const invalids: string[] = [];
    const outs: string[] = [];

    for (const item of keys) {
      if (await this.has(item)) {
        ins.push(item);
      } else if (this.existInNeedUpdates(item)) {
        invalids.push(item);
      } else {
        outs.push(item);
      }
    }

    return [ins, outs, invalids];
  }

  /**
   * get sources
   * first get local source, then fetch outs via fetch func with opt
   * @protected
   * @param {string[]} keys
   * @param {{ autoFetch: boolean }} opt
   * @return {*}  {Promise<T[]>}
   */
  protected async find(keys: string[], opt: { autoFetch: boolean } = { autoFetch: true }): Promise<T[]> {
    const [ins, outs, invalids] = await this.chunk(keys);
    const inContents = await this.findFromLocal(ins.concat(invalids));

    let outContents: T[] | undefined;
    if (opt.autoFetch && outs.length > 0) {
      this.logger.info('fetch out contents %j from server', outs);
      // fetch from server via outs
      outContents = await this.onFetch(outs);
    }

    if (invalids.length > 0) {
      this.logger.info('fetch invalid contents %j from server', invalids);
      // async fetch invalid sources
      this.onFetch(invalids);
    }

    if (outContents && outContents.length > 0) {
      return [...inContents, ...outContents];
    }
    return inContents;
  }

  /**
   * filter not exist list
   *
   * @protected
   * @param {string[]} list
   * @return {*}
   */
  protected async filterExists(list: string[]) {
    const notExists: string[] = [];
    for (const item of list) {
      if (await this.exist(item)) {
        notExists.push(item);
      }
    }
    return notExists;
  }

  /**
   * exist the source
   *
   * @param {string} key
   */
  public async exist(key: string) {
    return !!(await this.has(key));
  }

  /**
   * destroy the resource
   */
  public destroy() {
    this.hotResources.destroy();
    this.diskResources?.destroy();
  }
}
