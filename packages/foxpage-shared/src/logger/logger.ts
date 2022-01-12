import { format } from 'util';

import { isError } from 'lodash';

import { LoggerClass, Loggers } from './impl';
import { LOGGER_CONFIG, LOGGER_LEVEL, LOGGER_USE_LEVEL } from './level';
import { LoggerBase, LoggerErrorArguments, LoggerInfoArguments } from './types';

export type FoxpageLogger = LoggerProvider;

export type LoggerOption = {
  level?: LOGGER_LEVEL;
  procInfo?: number | string;
  customizeLoggers?: LoggerClass[];
};

class LoggerProvider implements LoggerProvider {
  private _level?: LOGGER_LEVEL;
  private type: string;
  private loggers: LoggerBase[] = [];
  private timerMap: Map<string, number> = new Map();
  private option?: LoggerOption;

  constructor(type: string, opt?: LoggerOption) {
    this.type = type;
    this._level = opt?.level ? opt.level : LOGGER_LEVEL.INFO;
    this.option = opt;
    this.init(opt?.customizeLoggers);
  }

  public init = (customizeLoggers: LoggerClass[] = []) => {
    this.loggers = Loggers.concat(...customizeLoggers).map(LoggerClass => new LoggerClass());
    return this;
  };

  // avoid circle error,
  private get level() {
    return this._level as LOGGER_LEVEL;
  }

  public debug = (msg: string, ...params: any[]) => {
    this.log(LOGGER_LEVEL.DEBUG, msg, params);
  };

  public info = (msg: string, ...params: any[]) => {
    this.log(LOGGER_LEVEL.INFO, msg, params);
  };

  public warn = (msg: string, ...params: any[]) => {
    this.log(LOGGER_LEVEL.WARN, msg, params);
  };

  public error = (msg: string, ...params: any[]) => {
    this.log(LOGGER_LEVEL.ERROR, msg, params);
  };

  public timeStart = (label: string, msg?: string, ...params: any[]) => {
    const time = +new Date();
    this.timerMap.set(label, time);

    if (msg) {
      this.info(msg, ...params);
    }

    return (msg?: string, ...params: any[]) => {
      this.timeEnd(label, msg, params);
    };
  };

  public timeEnd = (label: string, msg?: string, ...params: any[]) => {
    let cost = -1;
    const start = this.timerMap.get(label);
    if (start) {
      const now = +new Date();
      cost = now - start;
      this.debug('%s cost %d ms', label, cost);
      this.timerMap.delete(label);
    }
    if (msg) {
      this.info(msg, ...params, cost);
    }
    return cost;
  };

  public log = (level: LOGGER_USE_LEVEL, msg: string, params: any[]) => {
    if (level >= this.level) {
      const { prefix, method } = LOGGER_CONFIG[level];
      const err = params.find(isError);
      const errIndex = params.indexOf(err);
      const isErrorLog = level === LOGGER_LEVEL.ERROR;
      if (errIndex > -1 && isErrorLog) {
        params.splice(errIndex, 1);
      }
      const formateMsg = this.formatMessage(prefix, msg, params);
      const args = isErrorLog
        ? ([formateMsg, err, this.type] as LoggerErrorArguments)
        : ([formateMsg] as LoggerInfoArguments);
      this.loggers.forEach(logger => {
        (logger[method] as any).apply(logger, args as any);
      });
    }
  };

  public formatMessage = (level: string, msg: string, params: any[]) => {
    let formateMsg = msg;
    try {
      formateMsg = format(msg, ...params);
    } catch (error) {
      this.error('format message "%s" fail', msg, error);
    }
    const output = `[Foxpage] ${this.option?.procInfo ? '<' + this.option.procInfo + '>' : ''} [ ${level} ] <${
      this.type
    }> ${formateMsg}`;
    return output;
  };

  toJSON = () => {
    return {
      name: this.type,
      level: LOGGER_LEVEL[this.level],
    };
  };
}

export function createLogger(type: string, opt?: LoggerOption) {
  return new LoggerProvider(type, opt);
}
