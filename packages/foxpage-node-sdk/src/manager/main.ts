import { initManager } from '@foxpage/foxpage-manager';
import { ContentDetailInstance, relationsMerge } from '@foxpage/foxpage-shared';
import { Application, ContentDetail, ManagerOption, RelationInfo } from '@foxpage/foxpage-types';

import { config } from '../common';
import { pm2 } from '../pm2';

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
  await initManager({
    apps: config.get('apps'),
    dataService: config.get('dataService'),
    plugins: config.get('plugins') || [],
    commonPluginDir: config.get('commonPluginDir') || '',
    settings: {
      openSourceUpdate: (pm2.isPm2 && pm2.isMaster) || !pm2.isPm2,
      sourceUpdateHook: (data: unknown) => {
        pm2.broadcast(data);
      },
    },
    procInfo: {
      isMaster: pm2.isMaster,
      procId: pm2.id,
    },
    loggerConfig: config.get('logger'),
  } as ManagerOption);
}
