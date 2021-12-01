import { createLogger as _createLogger, Logger, LOGGER_LEVEL } from '@foxpage/foxpage-shared';

import { pm2 } from '../pm2';

export function createLogger(type: string) {
  return _createLogger(type, {
    level: (process.env.FOXPAGE_DEBUG || LOGGER_LEVEL.INFO) as LOGGER_LEVEL,
    procInfo: `${pm2.isMaster ? 'master' : 'slave'}:${pm2.id}`,
  }) as Logger;
}

export { Logger, LOGGER_LEVEL };
