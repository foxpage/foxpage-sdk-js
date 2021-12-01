import { DiskCache, DiskCacheOption } from './disk';
import { LRUCache } from './lru';

/**
 * create lru cache
 * @param maxSize max size
 * @returns lru cache instance
 */
export const createLRUCache = <T = any>(maxSize?: number) => {
  const lruCache = new LRUCache<T>(maxSize);
  return lruCache;
};

/**
 * create disk cache
 * @param opt disk cache options
 * @returns disk cache instance
 */
export const createDiskCache = <T = any>(opt: DiskCacheOption) => {
  const diskCache = new DiskCache<T>(opt);
  return diskCache;
};
