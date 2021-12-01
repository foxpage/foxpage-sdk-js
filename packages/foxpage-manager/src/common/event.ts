import EventEmitter from 'events';

import { FPEventEmitter } from '@foxpage/foxpage-types';

/**
 * foxpage common eventEmitter
 *
 * @export
 * @class FPEventEmitter
 * @extends {EventEmitter}
 * @implements {TypedEventEmitter<T>}
 */
export class FPEventEmitterInstance<T> extends EventEmitter implements FPEventEmitter<T> {
  constructor() {
    super();
  }
}
