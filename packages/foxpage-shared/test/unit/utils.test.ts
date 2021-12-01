import { random } from 'faker';
import { isEqual } from 'lodash';

import {
  buildMapFromIterator,
  createLocaleHasFormatter,
  diff,
  format,
  formatLocale,
  indexArray,
  mapObject,
} from '../../src/common/utils';

describe('common/utils', () => {
  it('map object value', () => {
    const source = {
      a: 1,
      b: 10,
      c: -22,
    };
    const cb = jest.fn(v => String(v));
    const target = mapObject(source, cb);
    expect(cb.mock.calls.length).toBe(3);
    expect(target).toEqual({ a: '1', b: '10', c: '-22' });
  });

  it('map object value ignore nill', () => {
    const source = {
      a: 1,
      b: '',
      c: undefined as any,
    };
    const cb = jest.fn(v => v);
    const target = mapObject(source, cb, true);
    expect('c' in target).toBeFalsy();
  });

  it('index array by key', () => {
    const itemA = { id: random.uuid() };
    const itemB = { id: random.uuid() };
    const itemC = {} as { id: string };
    const itemD = { id: itemB.id };
    const list = [itemA, itemB, itemC, itemD];
    const map = indexArray(list, 'id');
    expect(map[itemA.id]).toBe(itemA);
    expect(map[itemD.id]).toBe(itemB);
    expect(Object.keys(map).length === 2).toBeTruthy();
  });

  it('build map from iterator', () => {
    const itemA = { id: random.uuid() };
    const itemB = { id: random.uuid() };
    const itemC = {} as { id: string };
    const itemD = { id: itemB.id };
    const list = [itemA, itemB, itemC, itemD];
    const map = buildMapFromIterator(list, 'id');
    expect(map.get(itemA.id)).toBe(itemA);
    expect(map.get(itemD.id)).toBe(itemB);
    expect(map.size).toBe(2);
  });

  describe('formate string', () => {
    it('support "%s %j %d %%"', () => {
      const words = random.words();
      const number = random.number();
      const json = { foo: 'bar' };
      const str = 'str: %s, %%, json: %j, num: %d';
      const formatted = format(str, words, json, number);
      expect(formatted).toBe(`str: ${words}, %, json: ${JSON.stringify(json)}, num: ${number}`);
      expect(format(str)).toBe('str: %s, %, json: %j, num: %d');
    });

    it('formate error', () => {
      const err = new Error('test');
      const formatted = format('err:', err);
      expect(formatted.includes(err.message)).toBeTruthy();
    });

    it('formate extra params', () => {
      const obj = {
        key: 'foo',
      };
      const circleObj: any = {
        ref: null,
      };
      circleObj.ref = circleObj;

      const formatted = format('obj', obj, circleObj, true, 1, '3');
      expect(formatted).toContain('1');
      expect(formatted).toContain(String(true));
      expect(formatted).toContain(JSON.stringify(obj));
    });
  });

  it('createLocaleHasFormatter', () => {
    const formatter = createLocaleHasFormatter('en-US');
    expect(formatter.localeFormat('AA_bb')).toBe('EN_us');
  });

  describe('format locale', () => {
    it('support multi style', () => {
      expect(formatLocale('en-US')('AA-BB')).toBe('EN-US');
      expect(formatLocale('en-US')('AA-bb')).toBe('EN-us');
      expect(formatLocale('en-US')('aa-BB')).toBe('en-US');
      expect(formatLocale('en-US')('aa-bb')).toBe('en-us');
      expect(formatLocale('en-US')('AA_BB')).toBe('EN_US');
      expect(formatLocale('en-US')('AA_bb')).toBe('EN_us');
      expect(formatLocale('en-US')('aa_BB')).toBe('en_US');
      expect(formatLocale('en-US')('aa_bb')).toBe('en_us');
    });

    it('support fail locale', () => {
      expect(typeof formatLocale('xxx')('AA-BB') === 'string').toBeTruthy();
    });
  });
});
