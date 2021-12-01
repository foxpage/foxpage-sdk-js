import { SemVer } from 'semver';

import { DateString, DateTime } from '@foxpage/foxpage-shared';

export function transformRightTypeByLeft(left: any, right: any) {
  if (typeof right === 'string' && typeof left === 'object') {
    if (left instanceof DateTime) {
      return DateTime.fromString(right);
    }
    if (left instanceof DateString) {
      return new DateString(right);
    }
    if (left instanceof SemVer) {
      return new SemVer(right, true);
    }
  }
  return right;
}

type IncludesAble = {
  includes(val: any): boolean;
};

export function isIncludesAble(obj: unknown): obj is IncludesAble {
  return typeof (obj as IncludesAble).includes === 'function';
}
