import { LoggerBase } from '../types';

export interface LoggerClass {
  readonly enable: boolean;
  new (type?: string): LoggerBase;
}

export const Loggers: LoggerClass[] = [] as LoggerClass[];
