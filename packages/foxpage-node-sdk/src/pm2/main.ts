import { getApplications } from '@foxpage/foxpage-manager';

import { pm2 } from './pm2';

/**
 * init pm2
 */
export function initPm2(): null | undefined {
  if (!pm2.isPm2) {
    return null;
  }

  console.log(`I'm ${pm2.isMaster ? 'master' : 'worker'}`);

  const apps = getApplications();

  // pm2 receive master broadcast then to refresh app
  if (pm2.isWorker) {
    pm2.onMessage(data => {
      apps.forEach(app => {
        app.refresh(data);
      });
    });
  }
}
