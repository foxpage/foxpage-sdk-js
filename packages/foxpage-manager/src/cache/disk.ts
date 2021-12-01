import { pathExists, readJSON } from 'fs-extra';

import { ResourceCache } from '@foxpage/foxpage-types';

import { resolveContentPath, storeContent } from './local';

export type DiskCacheOption = { appId: string; type: string };

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

  constructor(opt: DiskCacheOption) {
    this.appId = opt.appId;
    this.type = opt.type;
  }

  /**
   * set disk cache
   *
   * @param {string} id
   * @param {T} resource
   * @return {*}  {Promise<void>}
   */
  async set(id: string, resource: T): Promise<void> {
    const dirs = this.generateDirs(id);
    const filePath = resolveContentPath(this.appId, dirs);
    this.diskCache.set(id, filePath);
    await storeContent(filePath, resource);
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
        return await readJSON(filePath);
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
    return this.diskCache.has(id) || (await pathExists(resolveContentPath(this.appId, this.generateDirs(id))));
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

  delete(_id: string): void {}
}
