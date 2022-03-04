import _debug from 'debug';

import { LoggerBase as Logger } from '@foxpage/foxpage-shared';

export default class ConsoleLogger implements Logger {
  static get enable() {
    return true;
  }
  private debugger: _debug.IDebugger;
  constructor(type: string) {
    this.debugger = _debug(`foxpage-sdk:${type}`);
  }
  public debug(msg: string): void {
    this.debugger(msg);
    console.debug(msg);
  }
  public info(msg: string): void {
    console.log(msg);
  }
  public warn(msg: string): void {
    console.warn(msg);
  }
  public error(msg: string, error?: Error): void {
    console.error(msg, error);
  }
}
