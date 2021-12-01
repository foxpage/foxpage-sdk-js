import { VariableBase, variablesMerge } from '../../../src';

describe('merger/variable', () => {
  it('no statics', () => {
    const dynamics: VariableBase<any>[] = [
      {
        name: 'dynamic',
        id: '1',
        type: '1',
        props: {},
      },
    ];
    const result = variablesMerge(undefined, dynamics);
    expect(result.length).toBe(1);
    expect(result).toContain(dynamics[0]);
  });

  it('no dynamics', () => {
    const statics: VariableBase<any>[] = [
      {
        name: 'static',
        id: '1',
        type: '1',
        props: {},
      },
    ];
    const result = variablesMerge(statics);
    expect(result.length).toBe(1);
    expect(result).toContain(statics[0]);
  });

  it('variable combine', () => {
    const variablesOne = [
      {
        scopeId: '',
        scopeType: 1,
        name: 'header',
        id: '43ae6970-daaa-11e9-8754-9d3785de2f75',
        type: 'data.sys',
        props: {
          test: 'not useful',
          type: 'json',
        },
      },
    ];
    const variablesTwo = [
      {
        scopeId: '',
        scopeType: 1,
        name: 'header',
        id: '43ae6970-daaa-11e9-8754-9d3785de2f75',
        type: 'data.sys',
        props: {
          type: 'json',
          newKey: 'new value',
        },
      },
    ];

    const result = variablesMerge(variablesOne, variablesTwo);
    expect(result.length).toBe(2);
    expect(JSON.stringify(result)).not.toMatch('not useful');
    expect(JSON.stringify(result)).toMatch('ibu:fe-common:*');
  });
});
