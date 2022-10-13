import _ from 'lodash';
import _LRUCache from 'lru-cache';

import { ResourceCache } from '@foxpage/foxpage-types';

export interface LRUCacheOptions {
  cloned?: boolean;
}

/**
 * lru cache
 *
 * @export
 * @class LRUCache
 * @implements {ResourceCache<T>}
 * @template T
 */
export class LRUCache<T> implements ResourceCache<T> {
  lruCache: _LRUCache<string, T>;
  opt?: LRUCacheOptions;

  constructor(maxSize?: number, opt?: LRUCacheOptions) {
    this.lruCache = new _LRUCache<string, T>({
      max: maxSize || 3000, // 0 will be Infinity
    });
    this.opt = opt;
  }

  /**
   * set resource
   *
   * @param {string} id
   * @param {T} resource
   */
  set(id: string, resource: T): void {
    this.lruCache.set(id, this.opt?.cloned === false ? resource : _.cloneDeep(resource));
  }

  /**
   * get resource
   *
   * @param {string} id
   * @return {*}  {(T | null | undefined)}
   */
  get(id: string): T | null | undefined {
    const result = this.lruCache.get(id);
    return this.opt?.cloned === false ? result : _.cloneDeep(result);
  }

  /**
   * has resource
   *
   * @param {string} id
   * @return {*}  {boolean}
   */
  has(id: string): boolean {
    return this.lruCache.has(id);
  }

  /**
   * delete resource
   *
   * @param {string} id
   */
  delete(id: string) {
    this.lruCache.del(id);
  }

  /**
   * reset
   *
   */
  destroy(): void {
    this.lruCache.reset();
  }

  /**
   * dump
   *
   * @return {*}  {Array<{ key: string; value: T }>}
   */
  dump(): Array<{ key: string; value: T }> {
    return this.lruCache.dump().map(({ k: key, v: value }) => ({
      key,
      value,
    }));
  }
}
