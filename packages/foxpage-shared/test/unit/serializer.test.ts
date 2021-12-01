import { random } from 'faker';

import { betterJSONStringify, toJSONFriendly } from '../../src/common/serializer';

const cleanObject = (obj: any) => JSON.parse(JSON.stringify(obj));

describe('serializer', () => {
  it('Set & Map serialize able', () => {
    const key = random.words();
    const value = random.words();
    const set = new Set();
    const map = new Map();
    const obj = { set };
    set.add(map);
    map.set(key, value);
    const newObj = toJSONFriendly(obj);
    const result = cleanObject(newObj);
    expect(result).toEqual({ set: [{ [key]: value }] });

    const str = betterJSONStringify(obj);
    const result2 = JSON.parse(str);
    expect(result2).toEqual({ set: [{ [key]: value }] });
  });

  it('function serialize able', () => {
    const fn = () => {};
    const obj = { fn };
    const newObj = toJSONFriendly(obj);
    const result = cleanObject(newObj);
    expect(result).toEqual({ fn: fn.toString() });

    const str = betterJSONStringify(obj);
    const result2 = JSON.parse(str);
    expect(result2).toEqual({ fn: fn.toString() });
  });
});
