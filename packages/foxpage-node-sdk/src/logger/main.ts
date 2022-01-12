import { getManager } from '@foxpage/foxpage-manager';
import { createLogger as _createLogger, Logger, LOGGER_LEVEL, LoggerClass } from '@foxpage/foxpage-shared';

import { pm2 } from '../pm2';

let loggers: LoggerClass[] | undefined;

export function createLogger(type: string, level?: LOGGER_LEVEL) {
  return _createLogger(type, {
    level: (level || process.env.FOXPAGE_DEBUG || LOGGER_LEVEL.ERROR) as LOGGER_LEVEL,
    procInfo: `${pm2.isMaster ? 'master' : 'slave'}:${pm2.id}`,
    customizeLoggers: loggers,
  }) as Logger;
}

export { Logger, LOGGER_LEVEL };

export async function initLogger() {
  loggers = [];
  const manager = getManager();
  if (!manager) {
    throw new Error('Not instanced manager');
  }

  const { onInitLogger } = manager.hooks || {};
  if (typeof onInitLogger === 'function') {
    loggers = (await onInitLogger()) as LoggerClass[];
  }
}
