type LOGGER_USE_LEVEL = 0 | 1 | 2 | 3 | 4;

export interface LoggerBase {
  debug: LoggerDebugFn;
  info: LoggerInfoFn;
  warn: LoggerWarnFn;
  error: LoggerErrorFn;
}

export interface Logger {
  debug(msg: string, ...params: any[]): void;

  info(msg: string, ...params: any[]): void;

  warn(msg: string, ...params: any[]): void;

  error(msg: string, ...params: any[]): void;

  timeStart(label: string, msg?: string, ...params: any[]): void;

  timeEnd(label: string, msg?: string, ...params: any[]): void;

  log(level: LOGGER_USE_LEVEL, msg: string, params: any[]): void;
}

export type LoggerDebugFn = (msg: string) => void;
export type LoggerInfoFn = (msg: string) => void;
export type LoggerWarnFn = (msg: string) => void;
export type LoggerErrorFn = (msg: string, error: Error | undefined, type: string) => void;

export type LoggerDebugArguments = Parameters<LoggerDebugFn>;

export type LoggerInfoArguments = Parameters<LoggerInfoFn>;
export type LoggerWarnArguments = Parameters<LoggerWarnFn>;
export type LoggerErrorArguments = Parameters<LoggerErrorFn>;
