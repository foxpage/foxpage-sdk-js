import { initManager } from '@foxpage/foxpage-manager';
import { ContentDetailInstance, relationsMerge } from '@foxpage/foxpage-shared';
import { Application, ContentDetail, ManagerOption, RelationInfo } from '@foxpage/foxpage-types';

import { config } from '../common';
import { getPm2 } from '../pm2';

/**
 * get relations
 * contains all relations
 * @param page
 * @param app
 * @returns
 */
export const getRelations = async (content: ContentDetail, app: Application) => {
  const instance = new ContentDetailInstance(content);
  return await app.getContentRelationInfo(instance);
};

/**
 * get relations batch
 * @param contents
 * @param app
 */
export const getRelationsBatch = async (contents: ContentDetail[] = [], app: Application) => {
  const relations: RelationInfo = {};
  for (const item of contents) {
    const relation = await getRelations(item, app);
    relationsMerge(relation, relations);
  }
  return relations;
};

/**
 * init foxpage node source manager
 */
export async function initSourceManager() {
  const pm2 = getPm2();
  const { isPm2 = false, isMaster = false, id: pmId = 0 } = pm2 || {};
  await initManager({
    apps: config.get('apps'),
    dataService: config.get('dataService'),
    plugins: config.get('plugins') || [],
    commonPluginDir: config.get('commonPluginDir') || '',
    settings: {
      openSourceUpdate: (isPm2 && isMaster) || !isPm2,
      sourceUpdateHook: (data: unknown) => {
        if (typeof pm2?.broadcast === 'function') {
          pm2.broadcast(data);
        }
      },
    },
    procInfo: {
      isMaster: isMaster,
      procId: pmId,
    },
    loggerConfig: config.get('logger'),
  } as ManagerOption);
}
