import { readJSON } from 'fs-extra';

import { Logger, ResourceCache } from '@foxpage/foxpage-types';

import { resolveContentPath, storeContent } from './local';

export type DiskCacheOption = { appId: string; type: string; logger?: Logger };

/**
 * disk cache
 *
 * @export
 * @class DiskCache
 * @implements {ResourceCache<T>}
 * @template T
 */
export class DiskCache<T> implements ResourceCache<T> {
  diskCache = new Map<string, string>();
  private appId: string;
  private type: string;
  private logger?: Logger;

  constructor(opt: DiskCacheOption) {
    this.appId = opt.appId;
    this.type = opt.type;
    this.logger = opt.logger;
  }

  /**
   * set disk cache
   *
   * @param {string} id
   * @param {T} resource
   * @return {*}  {Promise<void>}
   */
  async set(id: string, resource: T): Promise<void> {
    try {
      const dirs = this.generateDirs(id);
      const filePath = resolveContentPath(this.appId, dirs);
      this.diskCache.set(id, filePath);
      await storeContent(filePath, resource);
    } catch (e) {
      const msg = (e as Error).message;
      if (msg.indexOf('EEXIST') > -1) {
        this.logger?.warn('store content failed:' + msg);
      } else {
        this.logger?.error('store content failed:' + msg);
      }
    }
  }

  /**
   * get content from disk
   *
   * @param {string} id
   * @return {*}  {(Promise<T | null | undefined>)}
   */
  async get(id: string): Promise<T | null | undefined> {
    const filePath = resolveContentPath(this.appId, this.generateDirs(id));
    if (filePath) {
      try {
        const result = await readJSON(filePath);
        if (result && result.delete) {
          // the deleted content will return null;
          return null;
        }
        return result;
      } catch (error) {
        return null;
      }
    }
    return null;
  }

  /**
   * check if exist the content
   *
   * @param {string} id
   * @return {*}  {Promise<boolean>}
   */
  async has(id: string): Promise<boolean> {
    return this.diskCache.has(id) || !!(await this.get(id));
  }

  /**
   * update delete status for delete action
   *
   * @param {string} id
   * @return {*}  {Promise<void>}
   * @memberof DiskCache
   */
  async delete(id: string): Promise<void> {
    const result = (await this.get(id)) as any;
    if (result) {
      // update delete status: true
      result.delete = true;
      await this.set(id, result);
    }
  }

  private generateDirs(id: string) {
    return [this.type, id];
  }

  /**
   * destroy the instance
   *
   */
  destroy(): void {
    this.diskCache.clear();
  }
}
