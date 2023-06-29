import { getPath, getValue } from '@/parser/sandbox/main';

describe('parser/sandbox/main', () => {
  it('getPath', () => {
    const result = getPath("AA.DD['BB:CC']['DD.D']");
    expect(result).toBeDefined();
    expect(result.length).toBe(4);
    expect(JSON.stringify(result)).toContain(JSON.stringify(['AA', 'DD', 'BB:CC', 'DD.D']));
  });

  it('getPath:one', () => {
    const result = getPath('AA');
    expect(result).toBeDefined();
    expect(result.length).toBe(1);
    expect(JSON.stringify(result)).toContain(JSON.stringify(['AA']));
  });

  it('getPath with end', () => {
    const result = getPath('AA:BB');
    expect(result).toBeDefined();
    expect(result.length).toBe(2);
    expect(JSON.stringify(result)).toContain(JSON.stringify(['AA', 'BB']));
  });

  it('getValue', () => {
    const scope = {
      AA: {
        'BB:CC': {
          DD: 'hello world',
          EE: 'ee',
        },
      },
      E: {
        value: 'EE',
      },
    };
    const result = getValue(scope, "AA['BB:CC'][E:value]");
    expect(result).toBeDefined();
    expect(result).toBe(scope.AA['BB:CC'].EE);
  });
});
