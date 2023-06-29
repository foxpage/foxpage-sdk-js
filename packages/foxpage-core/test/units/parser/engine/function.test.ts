import { executeFun, getVars } from '@/parser/sandbox';

describe('parser/sandbox/function', () => {
  it('Parse function', () => {
    const scopes = {
      AA: {
        BB: {
          CC: 'cc',
          DD: 'dd',
        },
      },
    };
    const expression = 'function (aa){const a = {{AA:BB}}; const d = {{AA:BB:DD}}; return a.CC+this.b+aa+d;}';
    const result = getVars(expression, scopes).map((item, idx) => ({ ...item, varStr: `v_${idx}` }));
    const callData = { b: 2 };
    const aa = 11;
    const data = executeFun(expression, [callData, aa], result);
    expect(data).toBe('cc211dd');
  });
});
