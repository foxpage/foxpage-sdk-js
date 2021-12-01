import { Application, ManagerOption } from '@foxpage/foxpage-types';

import { ManagerImpl } from './manager';

let manager: ManagerImpl;

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
      manager.prepare();
      // register apps
      await manager.registerApplications(opt.apps);
    }
    return manager;
  } catch (e) {
    throw new Error(`Init manager failed.`);
  }
};

/**
 * get manager
 * @returns Manager
 */
export const getManager = (): ManagerImpl => {
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
};
