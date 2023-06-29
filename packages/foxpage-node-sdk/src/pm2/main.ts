import { getApplications } from '@foxpage/foxpage-manager';

import { config } from '../common';

import { createPm2, getPm2 } from './pm2';

/**
 * init pm2
 */
export function withPm2(): null | undefined {
  const pm2 = getPm2();
  if (!pm2?.isPm2) {
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

/**
 * create pm2
 */
export async function initPm2() {
  const pm2Config = config.get('pm2');
  await createPm2(pm2Config);
}
