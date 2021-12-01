import isError from 'lodash/isError';

import { MessageArray } from '@foxpage/foxpage-types';

import { isNotNill } from './utils';

export interface IMessages extends MessageArray {
  hasError?: boolean;
  formate(includeStack?: boolean): string[];

  stringify(splitter?: string): string;

  toJSON(): string[];
}

export class Messages extends Array<string | Error> implements IMessages {
  get hasError() {
    return this.some(isError);
  }

  formate(includeStack?: boolean) {
    return formatMessages(this, includeStack);
  }

  stringify(splitter = ' | '): string {
    return stringifyMessages(this, splitter);
  }

  toJSON() {
    return this.formate();
  }
}

export function stringifyMessages(messages: Array<string | Error> = [], splitter = ' | ') {
  return formatMessages(messages).join(splitter);
}

export function formatMessages(messages: Array<string | Error> = [], includeStack = false) {
  return messages.map(msg => (isError(msg) ? (includeStack ? msg.stack : msg.message) : msg)).filter(isNotNill);
}
