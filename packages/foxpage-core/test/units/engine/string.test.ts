import { random } from 'faker';

import { MessageArray } from '@foxpage/foxpage-shared';

import { executeString } from '../../../src/parser/sandbox/string';

describe('Engine executeString', () => {
  it('Keep origin type', () => {
    const obj = {
      foo: random.words(),
    };
    const val = executeString('{{obj}}', { obj });
    expect(val).toBe(obj);
  });

  it('Stringify variable value', () => {
    const obj = {
      foo: random.words(),
    };
    const val = executeString('obj: {{obj}}', { obj });
    expect(val).toBe(`obj: ${JSON.stringify(obj)}`);
  });

  it('Catch stringify error', () => {
    const error = new Error('test');
    const obj = {
      toJSON() {
        throw error;
      },
    };
    const messages: MessageArray = [];
    executeString('obj: {{obj}}', { obj }, messages);
    expect(messages.hasError).toBeFalsy();
    expect(messages.length).toBe(0);
  });

  it(`Undefined value isn't an availed value`, () => {
    const messages: MessageArray = [];
    executeString('obj: {{obj}}', { obj: undefined }, messages);
    expect(messages.hasError).toBeTruthy();
  });

  it('Replace string expression', () => {
    const fn = jest.fn(() => random.words());
    const scope = {
      foo: {
        bar: random.words(),
      },
      fn,
    };
    const res = executeString('bar is {{foo.bar}}', scope);
    expect(res).toBe(`bar is ${scope.foo.bar}`);
    executeString('{{fn()}}{{fn(1, 2, 3)}}', scope);
    expect(fn.mock.calls.length).toBe(2);
    expect(fn.mock.calls[1]).toEqual([1, 2, 3]);
  });

  it('Return origin value if only have one expression', () => {
    const scope = {
      obj: {
        a: random.words(),
        b: random.number(),
        c: random.boolean(),
      },
      fn: jest.fn(),
    };
    expect(executeString('{{obj}}', scope)).toBe(scope.obj);
    expect(executeString('{{obj.b}}', scope)).toBe(scope.obj.b);
    expect(executeString('{{fn}}', scope)).toBe(scope.fn);
    expect(typeof executeString('{{obj.a}}{{obj.b}}', scope) === 'string').toBeTruthy();
  });

  it('Parse array', () => {
    const res = executeString('{{[1, 2, 3]}}', {});
    expect(res).toEqual([1, 2, 3]);
  });

  it('Parse object', () => {
    const res = executeString('{{{ foo: "bar" }}}', {});
    expect(res).toEqual({ foo: 'bar' });
  });

  it('Parse primitive value', () => {
    expect(executeString('{{true}}', {})).toBeTruthy();
    expect(executeString('{{1}}', {})).toBe(1);
    expect(executeString('{{`1`}}', {})).toBe('1');
  });
});
