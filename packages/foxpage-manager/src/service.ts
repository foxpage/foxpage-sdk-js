import { Application, FoxRoute, ManagerOption } from '@foxpage/foxpage-types';

import { ManagerImpl } from './manager';

let manager: ManagerImpl | null;

/**
 * init resource manager
 * its singleton
 * @param opt init manager options
 * @example const opt = {
    apps: [{ appId: '1000', appName: 'app name', options: {} }],
    dataService: { host: '', path: '' },
  } as ManagerOption;
 * @returns {ManagerImpl}
 */
export const initManager = async (opt: ManagerOption): Promise<ManagerImpl> => {
  if (!manager) {
    manager = new ManagerImpl(opt);
  }
  try {
    if (manager) {
      let config = opt;

      const { afterManagerCreate } = manager.hooks || {};
      if (typeof afterManagerCreate === 'function') {
        config = ((await afterManagerCreate(opt)) as Array<ManagerOption>)[0];
      }

      // manager prepare
      await manager.prepare(config);

      // register apps
      await manager.registerApplications(opt.apps);
    }
    return manager;
  } catch (e) {
    manager = null;
    throw new Error(`Init manager failed: ${(e as Error).message}`);
  }
};

/**
 * get manager
 * @returns Manager
 */
export const getManager = () => {
  return manager;
};

/**
 * get application via appId
 * @param appId application appId
 * @returns Application|undefined
 */
export const getApplication = (appId: string): Application | undefined => {
  if (manager) {
    return manager.getApplication(appId);
  }
};

/**
 *  get appList
 * @param appIds
 * @returns Application[]
 */
export const getApplications = (appIds?: string[]): Application[] => {
  if (manager) {
    return manager.getApplications(appIds);
  }
  return [];
};

/**
 * get application via appName
 * @param slug application slug
 * @returns Application|undefined
 */
export const getApplicationBySlug = (slug: string): Application | undefined => {
  if (manager) {
    return manager.getApplicationBySlug(slug);
  }
  return undefined;
};

/**
 * get application via path
 * @param path user request path
 * @returns Application|undefined
 */
export const getApplicationByPath = (path: string): { app: Application; matchedRoute?: FoxRoute } | undefined => {
  if (manager) {
    return manager.getApplicationByPath(path);
  }
  return undefined;
};
