import { Logger } from '@foxpage/foxpage-shared';
import { ScheduleEvents } from '@foxpage/foxpage-types';

import { createLogger, FPEventEmitterInstance } from '../common';

export type ScheduleAction<T> = (data: T | undefined) => Promise<null | undefined | T>;

export interface ScheduleOptions {
  appId: string;
  interval: number;
}

export interface Schedule<T> {
  start(): void;
  stop(): void;
}

/**
 * schedule
 *
 * @export
 * @class Schedule
 * @extends {FPEventEmitterInstance<ScheduleEvents<T>>}
 */
export class Schedule<T> extends FPEventEmitterInstance<ScheduleEvents<T>> {
  private appId: string;
  public readonly interval: number;
  public readonly action: ScheduleAction<T>;
  private handler: NodeJS.Timer | undefined;
  public logger: Logger;

  private data?: T | null;

  constructor(action: ScheduleAction<T>, opt = {} as ScheduleOptions) {
    super();
    this.action = action;
    this.appId = opt.appId;
    this.interval = opt.interval;
    this.addListener('timeout', this.dispatch);
    this.logger = createLogger(`app@${this.appId} schedule`);
  }

  public start() {
    if (!this.handler) {
      this.handler = setInterval(() => this.emit('timeout'), this.interval);
    }
  }

  public stop() {
    if (this.handler) {
      clearInterval(this.handler);
      this.handler = undefined;
      this.data = null;
    }
  }

  private async dispatch() {
    try {
      const result = await this.action(this.data as T);
      // update nextData
      this.data = result;
      // dispatch receive data
      this.emit('DATA_RECEIVE', result);
    } catch (e) {
      this.emit('ERROR', e);
      this.logger.error('dispatch action error:', e);
    }
  }
}
