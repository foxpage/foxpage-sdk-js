import { random } from 'faker';

import { MessageArray } from '@foxpage/foxpage-types';

import { executeString, getVars } from '@/parser/sandbox/string';

describe('parser/sandbox/string', () => {
  it('Get string replaces', () => {
    const scopes = {
      AA: {
        BB: {
          CC: 'cc',
        },
      },
    };
    const expression = 'function (){const a = {{AA:BB}};return a;}';
    const result = getVars(expression, scopes);
    expect(result).toBeDefined();
    expect(JSON.stringify(result)).toContain(JSON.stringify(scopes.AA.BB));
  });

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
    const res = executeString('bar is {{foo:bar}}', scope);
    expect(res).toBe(`bar is ${scope.foo.bar}`);
    executeString('{{fn()}}{{fn(1, 2, 3)}}', scope);
    expect(fn.mock.calls.length).toBe(0);
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
    expect(executeString('{{obj:b}}', scope)).toBe(scope.obj.b);
    expect(executeString('{{fn}}', scope)).toBe(scope.fn);
    expect(typeof executeString('{{obj:a}}{{obj:b}}', scope) === 'string').toBeTruthy();
  });
});
