import { initManager } from '@foxpage/foxpage-manager';
import { ManagerOption } from '@foxpage/foxpage-types';

import { config } from '../common';
import { pm2 } from '../pm2';

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
