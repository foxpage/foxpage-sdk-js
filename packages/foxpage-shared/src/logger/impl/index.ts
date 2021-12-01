import { LoggerBase } from '../types';

import ConsoleLogger from './console';

interface LoggerClass {
  readonly enable: boolean;
  new (type?: string): LoggerBase;
}

export const Loggers: LoggerClass[] = [ConsoleLogger].filter(logger => logger.enable) as LoggerClass[];
