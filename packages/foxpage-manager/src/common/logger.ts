import { createLogger as _createLogger, LOGGER_LEVEL, LoggerClass } from '@foxpage/foxpage-shared';
import { FoxpageHooks, Logger, ManagerOption } from '@foxpage/foxpage-types';

let procInfo = '';
let loggers: LoggerClass[] | undefined;
let level = LOGGER_LEVEL.INFO;

export { Logger, LOGGER_LEVEL };

export const createLogger = (type: string, opt?: ManagerOption) => {
  const { isMaster, procId } = opt?.procInfo || {};
  procInfo = isMaster !== undefined || procId ? `${isMaster ? 'master' : 'slave'}:${procId}` : procInfo;
  return _createLogger(type, {
    level,
    procInfo,
    customizeLoggers: loggers,
  }) as Logger;
};

export async function initLogger(hooks: FoxpageHooks = {}, opt: ManagerOption['loggerConfig']) {
  if (opt?.level) {
    level = opt.level;
  }
  loggers = [];
  const { onInitLogger } = hooks;
  if (typeof onInitLogger === 'function') {
    loggers = (await onInitLogger()) as LoggerClass[];
  }
}
