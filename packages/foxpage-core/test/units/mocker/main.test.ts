import { Context, Variable } from '@foxpage/foxpage-types';

import { mockBlock, mockTemplate, withMock, withVariableMock } from '@/mocker/index';

import { mockRenderContext } from '@@/helper';

describe('mocker/main', () => {
  it('withMock', () => {
    const mock = require('@@/data/mocker/mock');
    const page = require('@@/data/mocker/page');
    const template = require('@@/data/mocker/template');
    const block = require('@@/data/mocker/block');
    const ctx = {
      ...mockRenderContext(),
      getOrigin: (type: string) => {
        if (type === 'page') {
          return page;
        }
        if (type === 'templates') {
          return [template];
        }
        if (type === 'blocks') {
          return [block];
        }
      },
    };

    const result = withMock([mock], ctx);
    expect(result).toBeDefined();
    expect(JSON.stringify(result.content)).toContain('111111111111');
  });

  it('mock template', () => {
    const mock = require('@@/data/mocker/mock');
    const template = require('@@/data/mocker/template');

    const result = mockTemplate(template, mock);
    expect(result).toBeDefined();
    expect(JSON.stringify(result.schemas)).toContain('mock template node');
  });

  it('mock block', () => {
    const mock = require('@@/data/mocker/mock');
    const block = require('@@/data/mocker/block');

    const result = mockBlock(block, mock);
    expect(result).toBeDefined();
    expect(JSON.stringify(result.schemas)).toContain('mock block node');
  });

  it('withVariableMock', () => {
    const mock = require('@@/data/mocker/mock');
    const page = require('@@/data/mocker/page');
    const variable = require('@@/data/mocker/variable');
    let mockedVariable;
    const ctx = {
      ...mockRenderContext(),
      getOrigin: (type: string) => {
        if (type === 'page') {
          return page;
        }
        if (type === 'mocks') {
          return [mock];
        }
      },
      updateResource: (target: string, _key: string, value: any) => {
        if (target === 'variables') {
          mockedVariable = value as Variable;
        }
      },
    } as Context;
    const result = withVariableMock([variable], ctx);
    expect(result).toBeDefined();
    expect(mockedVariable).toBeDefined();
    expect(JSON.stringify(mockedVariable)).toContain('variable mock');
  });
});
