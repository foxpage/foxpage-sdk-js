import { formatMessages, timeout } from '@foxpage/foxpage-shared';

import { config, createLogger } from '../common';
import { initSourceManager } from '../manager';
import { initResourceParser } from '../parser';
import { initPm2 } from '../pm2';

import { success } from './lifecycle';

const logger = createLogger('SDKIgnition');

/**
 * SDK ignition
 *
 */
async function SDKIgnition() {
  // collect init errors
  const errors: Error[] = [];
  const tryRun = async <T extends (...args: any[]) => any>(
    fn: T,
    level: 'warn' | 'error' = 'error',
    { retry = true } = {},
  ) => {
    try {
      await fn();
    } catch (error) {
      logger.warn(`call "${fn.name}" fail:`, error);

      if (retry) {
        logger.warn(`retry call "${fn.name}"`);
        await tryRun(fn, level, { retry: false });
      } else if (level === 'error') {
        errors.push(error as Error);
      }
    }
  };

  // init configs
  await tryRun(config.init);

  // init manager
  await tryRun(initSourceManager);

  // init pm2
  await tryRun(initPm2);

  // init parser
  await tryRun(initResourceParser);

  // check errors
  if (errors.length > 0) {
    setTimeout(() => {
      process.exit(-1);
    }, 1000);
    throw new Error('init foxpage sdk fail, please check errors log\n' + formatMessages(errors).join('\n'));
  }

  // update lifecycle
  success();
}

/**
 * Foxpage SDK ignition
 */
export async function ignition() {
  await timeout(SDKIgnition(), 1000 * 60 * 15);
}
