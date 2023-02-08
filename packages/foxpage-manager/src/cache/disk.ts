import crypto from 'crypto';

import { readJSON, remove } from 'fs-extra';
import globby from 'globby';
import _ from 'lodash';

import { Logger, ResourceCache } from '@foxpage/foxpage-types';

import { resolveContentDir, resolveContentPath, storeContent } from './local';

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
  diskCache = new Map<string, { filePath: string; hash: string }>();
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
      const hash = this.computeMD5Hash(JSON.stringify(resource));
      const filePath = this.generateFilePath(id, hash);
      this.diskCache.set(id, { filePath, hash });

      await storeContent(filePath, _.cloneDeep(resource));

      await this.delete(id, false);
    } catch (e) {
      const msg = (e as Error).message;
      if (msg.indexOf('EEXIST') === -1) {
        this.logger?.error('store content failed: ' + e);
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
    const cached = this.diskCache.get(id);
    try {
      let filePath = '';
      if (cached) {
        filePath = cached.filePath;
      } else {
        const rootDir = this.getRootDir(id);
        const files = await this.getFiles(rootDir);
        filePath = files[0];
      }
      if (filePath) {
        const result = await readJSON(filePath);
        return result ? _.cloneDeep(result) : null;
      }
      return null;
    } catch (e) {
      // this.logger?.info('get content failed: ' + e);
      return null;
    }
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
   * @param {boolean} all true: remove all files of the dir, false: only remove the invalid files
   * @return {*}  {Promise<void>}
   * @memberof DiskCache
   */
  async delete(id: string, all = true): Promise<void> {
    const cached = this.diskCache.get(id);
    if (cached) {
      try {
        const rootDir = this.getRootDir(id);
        if (all) {
          await remove(rootDir);
          this.diskCache.delete(id);
        } else {
          const files = await this.getFiles(rootDir);
          const doRemove = async (list: string[]) => {
            for (const fileName of list) {
              if (!fileName.includes(cached.hash)) {
                // only remove the invalid files
                await remove(fileName);
              }
            }
          };
          await doRemove(files);
        }
      } catch (_e) {
        // this.logger?.warn('remove content failed,' + e);
      }
    }
  }

  private getRootDir(id: string) {
    const dirs = [this.type, id];
    const rootDir = resolveContentDir(this.appId, dirs);
    return rootDir;
  }

  private generateFilePath(id: string, hash: string) {
    const dirs = [this.type, id, hash];
    const filePath = resolveContentPath(this.appId, dirs);
    return filePath;
  }

  private computeMD5Hash(code: string, len = 8) {
    const md5 = crypto.createHash('md5');
    md5.update(code);
    const hash = md5.digest('hex');
    return hash.substring(0, len);
  }

  private async getFiles(root: string) {
    const files = await globby('**/*', {
      absolute: true,
      onlyFiles: true,
      cwd: root,
    });
    return files;
  }

  /**
   * destroy the instance
   *
   */
  destroy(): void {
    this.diskCache.clear();
  }
}
