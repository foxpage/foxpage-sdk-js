import { random } from 'faker';

import { MessageArray } from '@foxpage/foxpage-shared';

import { compilePropsToGetter } from '../../../src/parser/sandbox/compile';

describe('Engine compile', () => {
  it('Base', () => {
    const props = {
      num: random.number(),
      str: random.words(),
      arr: [
        {
          child: random.boolean(),
        },
      ],
      obj: {
        subArr: [random.words()],
      },
    };
    const messages: MessageArray = [];
    const getter = compilePropsToGetter(props, messages);
    const val = getter({}, []);
    expect(messages.length).toBe(0);
    expect(val).toEqual(props);
  });

  it('With quotation marks', () => {
    const props = {
      api: { method: 'POST', serviceCode: '13496', serviceInterface: 'getCommonHtml', type: 'api.soa2' },
      type: 'json',
      params: {
        head: {
          site: '{{dep}}',
        },
        htmlTemplatesVersion: 'C',
        options: '{"showlanguage":"1","useexternaljs":"1","norequirejsconfig":"1","nocomponents":"1"}',
        htmlTemplatesType: 'PublicHead',
      },
    };
    const messages: MessageArray = [];
    const getter = compilePropsToGetter(props, messages);
    const val = getter({ dep: {} }, []);
    expect(messages.length).toBe(0);
    expect(val.api).toEqual(props.api);
  });

  it('With variables', () => {
    const props = {
      obj: '{{obj}}',
      str: `find '{{name}}' with {{age}}`,
    };
    const obj = {
      words: random.words(),
      bool: random.boolean(),
    };
    const name = random.words();
    const age = random.number();
    const getter = compilePropsToGetter(props);
    const actual = getter({ obj, name, age }, []);
    const expected = { obj, str: `find '${name}' with ${age}` };
    expect(actual).toEqual(expected);
  });

  it('Catch error', () => {
    const props = {
      obj: `{{obj1['some']}}`,
      normal: random.words(),
    };
    const messages: string[] = [];
    const getter = compilePropsToGetter(props);
    const actual = getter({}, messages);
    expect(messages.length).toBe(1);
    expect(actual).toEqual({ obj: undefined, normal: props.normal });
  });

  it('Value include "', () => {
    const props = {
      obj: '{{obj}}',
      str: `find '{{name}}' with {{age}}`,
    };
    const obj = {
      words: '"some words"',
      bool: random.boolean(),
    };
    const name = '"other words"';
    const age = random.number();
    const getter = compilePropsToGetter(props);
    const actual = getter({ obj, name, age }, []);
    const expected = { obj, str: `find '${name}' with ${age}` };
    expect(actual).toEqual(expected);
  });

  it('With two variable', () => {
    const props = {
      val: '{{foo}}{{bar}}',
    };
    const fn = compilePropsToGetter(props);
    const res = fn({ foo: 'foo', bar: 'bar' }, []);
    expect(res).toEqual({ val: 'foobar' });
  });

  it('Support eol', () => {
    const props = {
      val: '{{foo; \r\nbar;}}',
    };
    const fn = compilePropsToGetter(props);
    const res = fn({ foo: 'foo', bar: 'bar' }, []);
    expect(res).toEqual({ val: 'foo' });
  });
});
