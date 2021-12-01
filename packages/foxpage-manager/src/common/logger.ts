import { createLogger as _createLogger, LOGGER_LEVEL } from '@foxpage/foxpage-shared';
import { Logger, ManagerOption } from '@foxpage/foxpage-types';

let procInfo = '';

export const createLogger = (type: string, opt?: ManagerOption) => {
  const { isMaster, procId } = opt?.procInfo || {};
  procInfo = isMaster && isMaster ? `${isMaster ? 'master' : 'slave'}:${procId}` : procInfo;
  return _createLogger(type, { level: opt?.loggerConfig?.level || LOGGER_LEVEL.INFO, procInfo }) as Logger;
};
