import { LoggerBase } from './types';

export enum LOGGER_LEVEL {
  DEBUG = 1,
  INFO = 2,
  WARN = 3,
  ERROR = 4,
  NONE = 5,
}

export type LOGGER_USE_LEVEL = Exclude<LOGGER_LEVEL, LOGGER_LEVEL.NONE>;

export const LOGGER_CONFIG: Record<LOGGER_USE_LEVEL, { prefix: string; method: keyof LoggerBase }> = {
  [LOGGER_LEVEL.DEBUG]: {
    prefix: 'DEBUG',
    method: 'debug',
  },
  [LOGGER_LEVEL.INFO]: {
    prefix: 'INFO',
    method: 'info',
  },
  [LOGGER_LEVEL.WARN]: {
    prefix: 'WARN',
    method: 'warn',
  },
  [LOGGER_LEVEL.ERROR]: {
    prefix: 'ERROR',
    method: 'error',
  },
};
