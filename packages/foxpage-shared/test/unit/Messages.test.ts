import { isArray } from 'util';

import { random } from 'faker';

import { Messages } from '../../src';

describe('Messages', () => {
  it('like array', () => {
    const ins = new Messages();
    expect(isArray(ins)).toBeTruthy();
  });

  it('json stringify able', () => {
    const ins = new Messages();
    const msg = random.words();
    ins.push(new Error(msg));
    const str = JSON.stringify(ins);
    expect(str.includes(msg));
  });

  it('format messages with string & error', () => {
    const ins = new Messages();
    ins.push(new Error('test'), random.words(), new Error(random.words()));
    const formatted = ins.formate(true);
    formatted.forEach(msg => {
      expect(typeof msg === 'string').toBeTruthy();
    });
  });

  it('stringify with splitter', () => {
    const ins = new Messages();
    const msg = random.words();
    const splitter = '|';
    ins.push(new Error(msg), 'some msg');
    const str = ins.stringify(splitter);
    expect(str.includes(splitter)).toBeTruthy();
  });

  it('find error', () => {
    const ins = new Messages();
    ins.push(new Error('test'));
    expect(ins.hasError).toBeTruthy();
  });
});
